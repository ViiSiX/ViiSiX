+++
date = "2017-04-19T21:06:09+07:00"
title = "Implement Continuous Integration the right way"
author = "Nghia Tr. Nguyen"
summary = "In recent years, Agile methodology has been raising popularly together with CI (Continuous Integration) and CD (Continuous Delivery/Deployment) with the expectation of fast and stabled software products delivery. But what exactly are CI-CD and how to apply them? Let's have a walk."
keywords = ["viisix", "viisix nghia continuous integration", "continuous integration"]
feature_image = "blog-images/implement-ci-the-right-way/01.png"
feature_image_v_adjust = 12.5

+++
**_* based on my personal experiences_**

{{< figure src="/blog-images/implement-ci-the-right-way/01.png" alt="Beta and test rails" >}}

In recent years, Agile methodology has been raising popularly together with CI (Continuous Integration) and CD (Continuous Delivery/Deployment) with the expectation of fast and stabled software products delivery. But what exactly are CI-CD and how to apply them? They are not simple some technologies or techniques that enable your team to build up products more quickly by injecting some Shell scripts into deployment processes, they are, indeed, a process to be applied in a consistent and continuously way.

Applying CI means your team have to adapt to a process required them to frequently develop and commit their source code in the same repositories, plus having the new code checked as soon as possible to detect issues and defects earlier. Ideally - *in technical view* - a commit to a Software Configuration Management repository that can trigger automatic builds and tests that will do the later job, yet the earlier job is used to be failed as the results of rapid development and deadlines submission.

Testing is the backbone of CI
-----------------------------

Automation testing to me is the backbone of CI, lead to most of its benefits from earlier detection of bugs and defects to saving time and efforts from fixing those at earlier states. As automation testing will ensure that every commits of code to the repository is running right as the way it should, at least, in the coverage of those tests. Maybe the team could be fine with your QAs and the current development practice, however beware of the bottleneck going to rampage on your release days.

*But what kind of automation test should be applied?*

- Unit testing checks every produced units in your software factory. Unit tests are small and powerful, some stay as the basic facts of your software logic, but they are usually ignored because of the initial cost.
- Integration testing will be used to test the interactions between combined units.

Those two types of tests are ideally for CI implementing, as they can be developed by developers or testing team and can be run after automation building processes. Available tests can also be used by developers while coding.

System testing and acceptance testing is more complex and heavier than other methods, they required the whole system to be built before running and maybe require manual tests. I would not say that they do not in the house of the automation building processes, but they do rather stay at the end of the release circle, performed by testing teams and business owners.

Growing your team to a testing-driven one
-------------------------------------------
To succeed in implement CI, changing your team’s mindset take an important role. Processes must be followed and when necessary, a policy must be enforced. In my humble opinion the followings should be applied:

- Developer do testing, at least for unit and integration testing.
- Code cross-checking before merged.
- Only commit code when finished tasks to avoid unnecessary builds.
- Convert big stories to smaller ones, split big tasks into smaller tasks, this allow your team members to be able to complete their tasks, commit the code and have it checked. Smaller and detail tasks also allow you knowing what happened in the progress and take actions quickly in case of issues.
- Documents are always useful, so if you have not had your products documented, do it together with test implementation is a good choice because writing test cases already did parts of both tasks.

*Did we forget SysOps guys?*

Maybe yes, but remember those guys are the ones who glued everything together as a system. But what will be happened when everything is automated? Remember, who have set up the automation systems for you. The automation systems however did allow them to release painful supporting tasks, now those cool guys could <s>go fuck around (lol)</s> spend their time to research and improve your systems, even creating a whole test for your system.
