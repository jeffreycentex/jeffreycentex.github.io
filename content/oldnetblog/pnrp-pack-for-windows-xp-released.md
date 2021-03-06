---



date:  "2006-10-28"
aliases: ["/2006/10/28/pnrp-pack-for-windows-xp-released/"]
title: PNRP Pack for Windows XP Released
categories: ["old network blog"]
tags: ["old network blog"]
type: "oldnetblog"
---
This was something I found earlier in the week, but haven't had a chance to blog about it yet.  I also haven't tried it yet as I am currently dogfooding Vista in the last push to find bugs on all but my Server machines.


Microsoft has recently posted the update for PNRP (Peer Name Resolution Protocol) for Windows XP to make it compatible with PNRP v2 that is contained in Windows Vista.  Theoretically, this will allow you to use PNRP on a XP-based machine to connect (I would say a tunnel better describes this process) to IPV6 aware services on a Vista machine, without any other setup (i.e., no Dynamic DNS or IP address knowledge would be required).  I say this is theoretical as I haven't had a chance to try this as of yet with either IIS or Remote Desktop.


In the near future, I will be releasing an article that describes how to configure PNRP on a Windows Vista box and then how to connect to it from any another desktop running Vista or a properly configured Windows XP SP2 machine.


Note that you need to have IPV6 enabled on the Windows XP SP2 machine and install the Peer to Peer Networking Services.


For more background, check out this <a href="http://support.microsoft.com/kb/920342">KB Article</a>.


For the download, click <a href="http://www.microsoft.com/downloads/details.aspx?FamilyID=55219164-ec71-4a32-a648-4ed2582ebc7c&DisplayLang=en">here</a>.


