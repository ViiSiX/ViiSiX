+++
author = "Nghia Tr. Nguyen"
date = "2017-06-15T21:34:01+07:00"
keywords = ["viisix", "viisix nghia database index", "database index types", "index types"]
summary = "Working with databases or not, people working in IT field do know about database indexes. What is Database Index? Let's discover."
title = "Database Indexes Demystifying - What is a Database Index"
feature_image = "/blog-images/11/00.png"
feature_image_v_adjust = 10

+++

## "What is a Database Index?" - via a simple problem
People do use indexes to improve the speed of queries. But what is an index? And how it can help speeding up query
time? First, we will go through a simple problem:

<i>**Problem:** Finding if an integer number A is in an one-dimension array with **n** integer number.</i>

<p class="center bold italic">Find -3 in [-1 3 5 2 -5 4 8 10 3 2 -6 ... -3]</p>

The simplest way is, to check every numbers in the array to see if they equal to negative three. If there is
a [-3] at the 20th or 100th position in the array, the finding speed seem to be very fast with nowadays computers'
processors. But what if [-3] number is standing at the end of an array with the size of millions? Seem to take a
while to find the target using linear algorithm.

But thankfully there is also a represented array for the original array, in which having all the values in that array
and their positions. The problem size will be reduced steadily. For example:

<p class="ml4 bold italic">
-6: [11, ...]<br/>
-5: [5, ...]<br/>
-3: [n]<br/>
2: [4, 10, ...]<br/>
...
</p>

There are two benefits from this method:

- Searching space could be reduced.
- Searching candidates were sorted, therefore other algorithms, usually binary search, can be applied to increase the 
searching speed (from *O(N)* to *O(log(N))* operations, or in an example, from the average of *500,000* to under *20* 
operations).

But it also has down side problems:

- You have to spend additional memory and storage for the represented array.
- By every change you made to the original array, you also have to update the represented array as well.

Now we can have a look back to Database Systems. The problem is quite similar: ***to perform a search for a 
very few information in a table having millions of records, and a index's role is make the search faster
by reducing the search problems' size.***

But RDBMS's search problems are not simple as our little ones. They have to search with many criteria, 
thus its data records are not stored continuously in disks but scattered all over the datafile(s) and 
disk blocks. One table can have many indices as they support different execute plans on different columns.

### Applied for database constraints

Not only being used for searching, indexes are also used to forming and policing database constraints. The constraints
are used to enforce a set of rules into your database schema, ensuring the consistency of your data thus improving your
database's performance.

### Dense index and Sparse index

In a **Dense index**, existing all the search values of indexed columns.

{{< figure src="/blog-images/11/01.png" alt="Ex01. Dense index on Student's ID" >}}
{{< figure src="/blog-images/11/02.png" alt="Ex02. Dense index on Students data sorted by gender" >}}

On the opposite side, **Sparse index** only stores some search values of the indexed columns, therefore 
reducing the storage space but increasing the records locating time. **Sparse index** is applicable only 
for the columns on which the tables data is stored sequentially.

{{< figure src="/blog-images/11/03.png" alt="Ex03. Sparse index on Students data sorted by their name" >}}

### Primary index and Secondary index 

**Primary index (or clustered index):** not only the index is stored in orders, but also the data records. 
These indexes use to be tables' primary key, but not always, like the clustered indexes for multiple columns. 
This method can reduce the index's size as RDBMS don't have to store all the indexed columns' values, but will 
increase the cost of inserting new record into every new data block.

{{< figure src="/blog-images/11/04.png" alt="Ex04. Primary index can be apply on student ID column" >}}

**Secondary index (or non-clustered index):** data records can be inserted without the order of indexes. But the
index must be a reflect of indexed columns in its order, meaning storing all of the indexed columns' values.
The benefits of this type of index is fast search on non-ordered columns, but then on every modification on
the indexed data can lead to the updating of index. The cost for fetching related records is also higher than
using primary index, since data records are not stored sequentially.

{{< figure src="/blog-images/11/05.png" alt="Ex05. Secondary index on students' class attribute" >}}
