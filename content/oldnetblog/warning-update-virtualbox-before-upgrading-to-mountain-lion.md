---



date:  "2012-07-25"
aliases: ["/2012/07/25/warning-update-virtualbox-before-upgrading-to-mountain-lion/"]
title: 'Warning:  Update VirtualBox before Upgrading to Mountain Lion'
categories: ["old network blog"]
tags: ["old network blog"]
type: "oldnetblog"
---
Note to the wise:


If you are upgrading to Mac OS X Mountain Lion, make sure that your copy of VirtualBox is up-to-date.  If it isn't, and if you are running a VBoxHeadless session to start a VM at login, you will be in a boot loop as the Mac will bugcheck and do a soft reboot.


That's why if you visited my weather website this afternoon and didn't see up-to-date information - my VBoxHeadless instance running my XP VM (for the Weather Station software) was causing a reboot.  All is fixed now.  :)


