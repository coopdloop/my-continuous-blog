---
title: "The Second Brain Methodology"
pubDate: "2024-08-01"
description: "Let's talk about why you need a secondary repository, like a secondary brain of information."
ttr: "8 min"
author: "Cooper Wallace"
authorImage: "https://blog-photo-bucket.s3.amazonaws.com/high_qual_pfp_informal_cropped_circle.jpg"
authorImageAlt: "Cooper Wallace"
image: "https://zenkit.com/wp-content/uploads/2021/04/Zettelkasten-Steps-1024x727.png"
imageAlt: "The full Astro logo."
tags: notes, efficiency, repository, information, zettelkasten, obsidian, notion, ai
---

# Introduction

Welcome to my second blog post! If you are reading this, thank you for taking time out of your day!
\
\
I want to talk about *__"Note-Taking"__*.
\
\
Most of the time when we take notes, they are temporary, or even get lost. Generally, notes are taken in moments of human desperation in hopes to setup a recall on first-impression tasks or information. Notes can become disorganized or even stale. It does not have to be this way.
\
\
I want to talk about a great solution to this, and how you can use generative AI to power up your __second brain__, starting and ending with the simple act of gathering and taking notes.
\
\
As a pre-note, this blog post is non-standard for the type of posts to see on this site, however it goes over my compartmentalization of information I do on a daily basis, and how I can reproduce, recall, and generate so much code. On top of that, this system is beneficial for all my documentation efforts, Public and Private. Essentially in this information age, I need some way to hold important information so I can quickly recall it.


## Lets talk methods and concepts

### Zettelkasten

1. The Zettelkasten method is a powerful strategy for personal thinking and writing. It stands out as a highly effective way to manage knowledge, serving as an organizational system that helps you systematically arrange and develop your ideas while working.

![Zettelkasten](https://zenkit.com/wp-content/uploads/2021/04/Zettelkasten-Steps-1024x727.png "Zettelkasten")

img credit: https://zenkit.com/wp-content/uploads/2021/04/Zettelkasten-Steps-1024x727.png


### Knowledge Management System

1. A knowledge management system is highly recommended to follow the Zettelkasten __Second brain__ methodology. A tool like __Obsidian__, __OneNote__, or __Notion__, are all acceptable.
2. In my case, I use Obsidian to hold all my knowledge. Obsidian is a versatile tool designed for efficient note taking and knowledge management. It allows users to create and link notes in a networked way, making it easy to visualize and navigate complex information. With its powerful Markdown support and customizable features, Obsidian transforms how notes are organized and interconnected, facilitating a more dynamic and interconnected approach to managing knowledge.

Here is an example of that interconnected approach:
https://help.obsidian.md/Plugins/Graph+view
![Obsidian Node map](https://publish-01.obsidian.md/access/f786db9fac45774fa4f0d8112e232d67/Attachments/obsidian-graph-view.png
 "Obsidian Node map")
Here is a link to get Obsidian, and try the UI out:

[Download Obsidian](https://help.obsidian.md/Getting+started/Download+and+install+Obsidian)


### Quick formatted notes (Markdown)

1. Markdown provides a simple and effective way to format notes quickly and clearly. Its lightweight syntax allows for easy creation of headings, lists, links, and other formatting elements without the need for complex tools. By using Markdown, you can ensure that your notes are both structured and easily readable, making it an excellent choice for capturing and organizing information on the fly.

### Note taking workflows

1. Effective note taking workflows are crucial for maximizing productivity and organizing information efficiently. A well-structured workflow involves selecting the right tools, such as note-taking apps or digital notebooks, and establishing consistent practices for capturing, categorizing, and reviewing notes. By refining your note-taking process, you can enhance your ability to retain and utilize information, leading to better decision-making and project management.

## Obsidian and Notion AI workflow

1. In the integrated workflow using Notion and Obsidian, the process begins with creating a Markdown file in the Obsidian inbox.

1. Here, we will be creating a note that goes over Security Frameworks. We want to store this information in our second brain so we can easily reference it.
![obsidian create note](https://blog-photo-bucket.s3.amazonaws.com/TheSecondBrainMethodology/second_brain_03_image.png "Obsidian create note")
1. Each note is tagged, named, and continuously updated with new information.
![obsidian actual note](https://blog-photo-bucket.s3.amazonaws.com/TheSecondBrainMethodology/second_brain_02_image.png "Obsidian actual note")
1. After the note is reviewed and accepted, it is moved to a designated notes folder, categorized further into subfolders based on its tag name.
Here is the review:
![obsidian actual note](https://blog-photo-bucket.s3.amazonaws.com/TheSecondBrainMethodology/second_brain_04_image.png "Obsidian actual note")
1. Here is the 'Ok' on each file moving it to zettelkasten folder. Vim Macro: Leader > o > k
![obsidian actual note](https://blog-photo-bucket.s3.amazonaws.com/TheSecondBrainMethodology/second_brain_06_image.png "Obsidian actual note")
1. The files are then sorted automatically into the zettelkasten folder. I won't go into depth on that process and the upcoming process. I will leave a reference at the bottom to how this is done.
1. A sync script then automatically transfers all notes from the notes folder into multiple databases within Notion. This integration ensures that the information is seamlessly updated and organized across platforms. Once in Notion, users can leverage Notion AI to interact with their "Second brain," querying and analyzing the consolidated knowledge to enhance productivity and insight. Likewise I will leave a reference to how this is done at the bottom.
\
\
Upload to Notion from Obsidian output:
```
Processing files in /Users/lariat/library/Mobile Documents/iCloud~md~obsidian/Documents/coopdevsec/notes/fact
Uploading to notion database ...................b87b304697559
[ '2024-08-01_Key-Security-Frameworks-and-Compliance-Standards.md' ]
{"Name":{"title":[{"text":{"content":"Key Security Frameworks and Compliance Standards"}}]},"Tags":{"multi_select":[{"nam
e":"security"}]},"Date":{"date":{"start":"2024-08-01"}}}
Success! Entry added.
2024-08-01_Key-Security-Frameworks-and-Compliance-Standards.md processed.
```
1. Here we can see it in Notion.so
![Notion security](https://blog-photo-bucket.s3.amazonaws.com/TheSecondBrainMethodology/second_brain_07_image.png "Notion security")
1. Let's do some prompt engineering, and this will wrap up this blog post. :)
![obsidian actual note](https://blog-photo-bucket.s3.amazonaws.com/TheSecondBrainMethodology/second_brain_08_image.png "Obsidian actual note")
1. Notion AI used the newly added note as context to answer the question, even providing it as a reference I can navigate to. The power of this is endless.

## What's Next

Expect more posts in the future that are along the lines of app development and app security. I really enjoy putting my ideas to paper, as seen in this post. See you back soon!

## Inspiration and References

Youtube video:

[Note taking with Neovim and Obsidian](https://www.youtube.com/watch?v=1Lmyh0YRH-w&ab_channel=ZazenCodes)

Blog:

https://zenkit.com/en/blog/a-beginners-guide-to-the-zettelkasten-method/
