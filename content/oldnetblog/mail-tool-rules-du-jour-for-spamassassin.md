---



date:  "2004-02-05"
aliases: ["/2004/02/05/mail-tool-rules-du-jour-for-spamassassin/"]
title: 'Mail Tool: “Rules du Jour” for Spamassassin'
categories: ["old network blog"]
tags: ["old network blog"]
type: "oldnetblog"
---
For those of you out there who use <a href="http://spamassassin.org/">SpamAssassin</a> to filter junk mail from your mailbox, I want to point y’all to a tool that can help decrease the amount of SPAM you are getting now that spammers are adjusting to the new SA rules.  Take a peek at the <a href="http://www.exit0.us/index.php/RulesDuJour">Rules du Jour</a>site - it will allow you to update your ruleset on a fairly frequent basis (I do it once a week at my mail server) with new rules that will help defeat the new spamming technique. After installing the default rulesets available at <a href="http://www.exit0.us/index.php/RulesDuJour">Rules du Jour</a>, the amount of junk mail detected on my office domain has gone from about 80% to just under 99% (I haven’t had a false positive reported to me yet).


If you do use these additional rulesets, make sure you either increase your warning level to 6 or you will find some real email marked as spam (most real spam messages are running with a score of 30+ on my system, when they were about 6~9 before).


