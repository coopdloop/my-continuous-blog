---
title: "Building scaling Security apps with agentic workflows"
pubDate: "2025-07-01"
description: "Architecting the software of tomorrow."
ttr: "20 min"
author: "Cooper Wallace"
authorImage: "https://blog-photo-bucket.s3.amazonaws.com/high_qual_pfp_informal_cropped_circle.jpg"
authorImageAlt: "Cooper Wallace"
image: "/ai-friend.jpg"
imageAlt: "AI Friendly"
tags: Security, AI, Agent, LLM
---

# Building Security apps that scale with your environment

In this article, I will discuss my vision for the Security apps of tomorrow. My views are solely based off my experience, and what I see as the future of cybersecurity product development. I firmly believe that "AI stuffing" will become the new normal, and apps that leverage an LLM will perform better in the market than those that don't. This will be the case even if the LLM is not client facing, simply leveraging an LLM to 10x business logic and processes is enough for an advantage. Due to this, I want to demonstrate a methodology for developing a security app where leveraging an LLM can increase your security posture.

I believe the Cybersecurity industry is in a unique position to leverage AI with "agentic workflows" simply due to the sheer amounts of data our Security tools provide for us. Ultimately, it's up to the security team to leverage a tool to a degree of satisfaction -- however I will argue that simply creating workflows and processes with an LLM-in-the-loop, can provide 10x the value in your existing tool-sets.

## Okay, explain?

As Security engineers, let's think of LLM's as a glorified data analytics wizard that can adopt human workflows and processes. LLM's are extremely good at this type of work, and are becoming increasingly better due to the massive expansion in developer tooling around building "agents". There are many tools that expand on top of LLMs that make it very easy to interface against an LLM's prompt, essentially an eco-system for reducing entropy in LLM's inferencing. Tools like: CrewAI, LangGraph, ..., .... I personally favorite LangGraph for the extensive amount of developer tooling it provides for building an Agent. So let's build one!

## What's our goal?

I simply want to demonstrate and provide inspiration for those wanting to build in this turbulent every increasing technical wide world of cyber. I will be creating a dynamic, flexible, and unique agent that can perform data analytics on massive subsets of security contextual logs and outputs. What matters most here is how we structure our agent and can we make it scale.

## How to build a product?

This question inherently has varying answers due to it's subjectivity. For this post I will be emphasizing in product development to focus on minimizing technical debt, and increasing scalability of the app. Integrating an LLM to augment the output will have this effect, and simple rules in our graph (workflow) can have many compounding effects on our output. What is most important is having a definitive expectation for our workflow, and an interface for our output.

A simple view of this is:

Input: (Security logs, Context, Function calls) -> Transform: (Function calls, contextual analysis, goals) -> Output: (DB Adapter, API push, Event Bus, JSON, chatbot).

There are various directions to take in the workflow. What matters is the construction of this workflow to satisfy your requirements, and having evals to confirm it does satisfy our requirements.

## Let's define our specific requirements in our security app, and our security agent.

1. All relevant security contextual logs will be ingested and stored in a vector db.
2. Security contextual logs are from our security tooling, they are raw and non-transformed.
3. All security logs have a documented schema, understood by the agent.
4. There is a common data model that the agent outputs to.
5. The agent can answer questions that are security related.
6. The agent will fulfill every request, and is authorized certain tools in it's workflow.
7. The agent will run playbooks defined by the human

These specific requirements will help us scope the work and understand our app better.

## Some technology, and our dev environment

We can think of this app as a pipeline, where we begin constructing at our raw data, and ultimately enrich our data, and answer specific questions about our data. We can start with the implementation of an event bus, which will carry our data through many partitions for our agent to subscribe and ingest. Let's use kafka.
We will be using docker to build our network, and leveraging postgres vector
