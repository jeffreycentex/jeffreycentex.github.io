---



date:  "2006-02-19"
aliases: ["/2006/02/19/r2-domain-controller-promotion-tip/"]
title: R2 Domain Controller Promotion Tip
categories: ["old network blog"]
tags: ["old network blog"]
type: "oldnetblog"
---
(from the newsgroups)


One of the more common issues that people are experiencing when trying to add a new Windows 2003 R2 Server on an existing Windows 2003/2000 based network is that the Active Directory schema needs to be updated.  This step is normally performed by running the <strong>adprep /forestprep</strong> command (a similar command is required for upgrading from Windows 2000 to Windows 2003).


However, in order to update the schema, you should run this command from the computer you deemed your &#8220;Schema Operations Master&#8221;.  However, the version of adprep that will be installed on your &#8220;Schema Operations Master&#8221; computer won&#8217;t support the schema upgrade from R2.  <strong><em>You need to use the adprep command located on the 2nd disk (the R2 setup) - not the first disk.</em></strong>  You will find the adprep command in the <strong>CMPNENTS\R2\ADPREP</strong> folder.


After you complete this step, you can then promote a new R2 server as a domain controller.


Tags: <a href="http://technorati.com/tag/R2" title="See the Technorati tag page for 'R2'." rel="tag">R2</a>, <a href="http://technorati.com/tag/adprep" title="See the Technorati tag page for 'adprep'." rel="tag">adprep</a>, <a href="http://technorati.com/tag/dcpromo" title="See the Technorati tag page for 'dcpromo'." rel="tag">dcpromo</a>


