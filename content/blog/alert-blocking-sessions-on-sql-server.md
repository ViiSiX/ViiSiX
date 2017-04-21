+++
date = "2017-04-21T17:07:45+07:00"
title = "Alert blocking sessions on SQL Server"
summary = "Sometime your whole application is hang just because of deadlock or big query. For our case - yes, then I write this script and setup a job that run every 5 minutes to notice us for further checks."
author = "Trong-Nghia Nguyen"

+++
The below script worked on `SQL Server 2008`, please test on other versions and let me know if you have any feedback.
{{< figure src="/blog-images/alert-blocking-sessions-on-sql-server/01.png" >}}

    /* Setting up the configuration */
    DECLARE @AlertThresholdSecs int = 600;
    DECLARE @MailProfileToSendVia sysname = 'Default Profile';
    DECLARE @OperatorName sysname = 'Default Operator';

    -----------------
    -- BEGIN --------
    -----------------
    DECLARE @heavy_blocking_session TABLE(
        BlockedBy VARCHAR(10) NOT NULL,
        NoOfBlocking INT,
        WaitTimeInSeconds INT
    );

    SET NOCOUNT ON;

    WITH blocked_tables AS
    (
        SELECT
            s.session_id SessionId,
            s.login_name LoginName,
            s.login_time LoginTime,
            s.cpu_time/1000 CPUTime_s,
            (ISNULL(w.wait_duration_ms, 0)/1000) WaitTime_s,
            ISNULL(w.wait_type, N'') WaitType,
            ISNULL(w.resource_description, N'') WaitResource,
            ISNULL(CONVERT(varchar, w.blocking_session_id), '') BlockedBy,
            ISNULL(s.program_name, N'') [Application],
            ISNULL(s.host_name, N'') HostName,
            ISNULL(c.client_net_address, N'') NetworkAddress,
            ISNULL(db_name(r.database_id), N'') DatabaseName,
            ISNULL(r.command, N'') Command
        FROM sys.dm_exec_sessions s  
            LEFT JOIN sys.dm_exec_requests r
                ON s.session_id = r.session_id
            LEFT JOIN sys.dm_exec_connections c
                ON s.session_id = c.session_id
            LEFT JOIN sys.dm_os_tasks t ON (r.session_id = t.session_id AND r.request_id = t.request_id)
            LEFT JOIN
                (
                    -- One thread can be flagged as waiting for several different threads.
                    SELECT *, ROW_NUMBER() OVER (PARTITION BY waiting_task_address ORDER BY wait_duration_ms DESC) AS row_num
                    FROM sys.dm_os_waiting_tasks
                ) w ON (t.task_address = w.waiting_task_address) AND w.row_num = 1
        WHERE w.blocking_session_id IS NOT NULL
            -- AND ... [Your other conditions]
    )
    INSERT INTO @heavy_blocking_session
    SELECT
        BlockedBy,
        COUNT(BlockedBy) NoOfBlocking,
        MAX(WaitTime_s) WaitTimeInSeconds
    FROM blocked_tables
    GROUP BY BlockedBy;

    IF (SELECT COUNT(*) FROM @heavy_blocking_session WHERE WaitTimeInSeconds >= @AlertThresholdSecs) > 0 
    BEGIN 
        DECLARE @Body nvarchar(2000);
        DECLARE @Subject nvarchar(100);
        DECLARE @session_id varchar(10), @no_of_blocking int, @max_wait_seconds int;

        SET @subject = '[Warning] There are blocking sessions in ' + @@SERVERNAME;
        SET @Body = 'BlockedBySessionId' + CHAR(9) + 'NoOfBlockingSessions' + CHAR(9) + 'MaxBlockedTimeInSeconds' + CHAR(10);

        DECLARE blocking_cursor CURSOR
        FOR SELECT * FROM @heavy_blocking_session
        ORDER BY WaitTimeInSeconds DESC, NoOfBlocking DESC
        OPEN blocking_cursor;
        FETCH NEXT FROM blocking_cursor INTO @session_id, @no_of_blocking, @max_wait_seconds;
        WHILE @@FETCH_STATUS = 0
        BEGIN
            SET @Body = @Body + @session_id + CHAR(9) + CAST(@no_of_blocking AS nvarchar(10)) + CHAR(9) + CAST(@max_wait_seconds AS nvarchar(20)) +  + CHAR(10);
            FETCH NEXT FROM blocking_cursor INTO @session_id, @no_of_blocking, @max_wait_seconds;
        END;
        CLOSE blocking_cursor;
        DEALLOCATE blocking_cursor;

        SET @Body = @Body + CHAR(10) + 'Please check!' + CHAR(10) + CHAR(10);

        EXEC msdb..sp_notify_operator
            @profile_name = @MailProfileToSendVia,
            @name = @OperatorName,
            @subject = @subject, 
            @body = @Body;
    END;

    GO