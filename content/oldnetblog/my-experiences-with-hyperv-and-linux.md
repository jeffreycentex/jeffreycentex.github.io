---



date:  "2010-05-24"
aliases: ["/2010/05/24/my-experiences-with-hyperv-and-linux/"]
title: My Experiences with HyperV and Linux
categories: ["old network blog"]
tags: ["old network blog"]
type: "oldnetblog"
---
I thought I would post a few tidbits about my recent experience with HyperV and various Linux distributions.  As some of you know, I self host my websites on my Windows 2008 R2 server at my house.  In the past 6 months or so, I have rotated through many different linux distributions to host my websites, but each attempt ended with abject failure.


I have tried the following combinations of distributions and HyperV extensions:


<ul>
<li>Ubuntu 9.04 using the Microsoft HyperV extensions</li>
<li>Ubuntu 9.10 using the 2.6.32 kernel modules</li>
<li>Ubuntu 10.04 using the 2.6.32 kernel modules</li>
<li>Debian Lenny using the 2.6.32 kernel modules</li>
<li>CentOS 5.4 using the Microsoft HyperV extension v2</li>
<li>CentOS 5.4 using the Microsoft HyperV extension v2.1</li>
<li>Debian Lenny without using any extensions</li>
<li>CentOS 5.4 without using any extensions</li>
<li>Ubuntu 9.04 without using any extensions</li>
</ul>
All of these were running the 64-bit version of the operating system, but I also tried a 32-bit version to the same avail.  Each attempt ended with a system failure (kernel_hung_task) usually after about 2~3 days.  This is running on hardware that can handle a full Windows 2008 R2 load or an individual Linux install with no hiccups.  I allocated each VM 100 GB hard drive partition, the synthetic NIC device (on those running extensions, otherwise the legacy NIC was used), and 3 GB of RAM.  The systems that did not exhibit the kernel_hung_task error just stopped functioning in a hung state without any logging of any type.


Running VMWare, Virtual PC, or VirtualBox works just fine - other than the inconvenience of having to use an application type of virtualization versus a hypervisor-based system.


So where does that leave me?  I no longer use HyperV for running Linux boxen.  HyperV works wonderfully for Windows-based systems and (much) earlier Linux builds (i.e., I'm running a Fedora Core 9 box at work for spam filtering that has no hiccups, but running a Fedora 12 box causes the system hang issues).


