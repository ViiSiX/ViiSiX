+++
date = "2017-04-21T13:48:04+07:00"
title = "SQL Server - Tricks for special date values"
summary = "Sometimes you need some special value for querying data, this article will help you."
author = "Trong-Nghia Nguyen"

+++
Some queries that will help you get special date values in MS SQL Server:

|**Value**  |**Query**|
|---|---|
|First date of month |`SELECT CAST(DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0) AS DATE)`  |
|Last date of month  |`SELECT CAST(DATEADD(d, -1, DATEADD(m, DATEDIFF(m, -1, GETDATE()), 0)) AS DATE)` |
|First date of year |`SELECT CAST(DATEADD(yy, DATEDIFF(yy, 0, GETDATE()), 0) AS DATE)`  |
|First date of year  |`SELECT CAST(DATEADD(d, -1, DATEADD(yy, DATEDIFF(yy, -1, GETDATE()), 0)) AS DATE)` |
