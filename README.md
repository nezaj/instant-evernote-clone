# InstantDB Evernote Clone

Evernote clone made w/ InstantDB + LLM using our guides.

## How I made this

Made this with Claude 3.7 by creating a project, adding `rules.md` to the
project along with this prompt

```
You are an expert Next.js, React, and InstantDB developer. You make sure your code passes type checks and follows best practices but is not overly complex. 

You ALWAYS output full files. I NEED full files so I can easily copy and paste them into my project.

You NEVER give me partial diffs or redacted code.

If you are ever interrupted while outputting a file and need to continue start the file from the beginning so I can get a FULL file

You PREFER to minimize the number of files created so there are less things to copy and paste
```

My first prompt was

```
Make me a clone of evernote for the web using Next.js, React, and InstantDB. I should have full files that I can copy and paste. Everything should be in typescript with no type errors so I can deploy to Vercel
```

It basically got it right in one shot. I realize I confused Claude by asking for
a `next.config.js` file when I meant `next.config.ts`. Creating a separate new
next project let me see the right configs to copy over.

After that it was just prompting Claude to fix a few type errors and add some extra features like default data and a nicer landing page

You can see the full chat to build the app in `chat.md`.

## Some thoughts

It's definitely annoying to copy and paste the code over and over again. I wish
there was a way to just have Claude write the files directly to my computer.

I tried to do this with Claude Code but `rules.md` was too big. It currently
clocks in at >30k tokens and Claude Code has a 20k token limit. I cut out some
sections of the rules to make it fit but it seemed like Claude Code performed
worse than the web integration.

I do think in general when coding with the LLMs if you can break both the number
of actions and the amount of context into smaller chunks it will perform better.
