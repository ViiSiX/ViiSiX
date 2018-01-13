+++
author = "Nghia Tr. Nguyen"
date = "2017-06-10T15:59:56+07:00"
feature_image = "/logo/mysql.png"
feature_image_v_adjust = 12
keywords = ["viisix", "viisix nghia mysql", "mysql stored procedure", "mysql user-defined function", "mysql function procedure"]
summary = "Like other relational database management systems, MySQL allows its users to programming inside its using Stored Procedure and User-Defined Function. Here is some of my experiences working with them."
title = "Notes about programming in MySQL"

+++
<i>*In this article I will use **SP** as Stored Procedure and **Function** as User-Defined Function.</i>

## Differences

|   | Stored Procedure | User-Defined Function |
|---|-----|-----|
| How to run | Using `CALL` in MySQL console or procedure calling functions in connector libraries | Using like other native functions in MySQL: calling them inside a SQL statement |
| Example (MySQL Console) | `CALL my_procedure(arg1);` | `SELECT id, my_function(id) FROM my_table LIMIT 10;` |
| Example (Python Connector) | `cursor.callproc('my_procedure', args=('arg1'))` | `cursor.execute('SELECT id, my_function(id) FROM my_table LIMIT 10')` |
| Return | None or cursor (tabular result) of the last `SELECT` statement inside the procedure | A value in defined data type (varchar, char, int...) |
| Modify data | Yes | No |
| Usage | Creating a database layer API | Extending SQL queries |

## Pros & Cons

### Pros
- Security: in some specific cases when you can not public the database schema or data processing logic to your developers,
*SP* and *Function* is a good solution.
- Data consistency: your data processing logic will be the same whatever the data source is since all the application
is using the same T-SQL set defined in *SP* and *Function*.

### Cons
- Difficult to change your technology: each RDBMS has its own query syntax and structure, you will have another challenge
migrating to the new technology at Database layer. You have to rewrite all of your *SP* and *Function* when you move. But
this is not the big duel as you won't change your RDBMS often.
- Implementing with ORM will be harder as you have to write more code just to support *SP* and *Function*.
- You won't like debugging MySQL's *SP* and *Function*.
- Event if you store your code in a git repository, deployment and granting permission are also counted for your troubles.

## Tips

<i>* Based on my experiences.</i>

1. Naming
    Naming variables and arguments in *SP* and *Function* sometime make me lost my temper, since I could not figure out
    from which target the names are. I usually name them with a prefix showing their positions and usages. For examples:
    
    - in_\*: input arguments of a *SP*/*Function*.
    - inter_\*: variables to be used in side a *SP*/*Function*.
    - out_\*: for output, of course.

2. Definer
    One should not use their own MySQL's account to define a *SP*/*Function*, as the RDBMS also store the *SP*/*Function*'s
    definer. Instead of that, specify a system user like `sp_and_function@'db_host'` will help you avoid later error if
    the user's account is deleted.
    
3. Return the result
    With *SP*, the return cursor should have same number of columns for all logic branch. This will help application
    developer on mapping with their code. In addition, an extra status column will help you on later debugging.
