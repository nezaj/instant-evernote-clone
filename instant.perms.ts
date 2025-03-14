// instant.perms.ts
import type { InstantRules } from '@instantdb/react';

const rules = {
  $default: {
    allow: {
      $default: "auth.id != null", // By default, only authenticated users can access
    }
  },

  $users: {
    allow: {
      view: "auth.id == data.id", // Users can only see their own user data
    }
  },

  profiles: {
    allow: {
      view: "auth.id == data.ref('$user.id')", // Users can only see their own profile
      create: "auth.id != null",
      update: "auth.id == data.ref('$user.id')", // Users can only update their own profile
    }
  },

  notes: {
    allow: {
      view: "auth.id == data.ref('creator.id')", // Only creator can see their notes
      create: "auth.id != null",
      update: "auth.id == data.ref('creator.id')", // Only creator can update their notes
      delete: "auth.id == data.ref('creator.id')", // Only creator can delete their notes
    }
  },

  notebooks: {
    allow: {
      view: "auth.id == data.ref('creator.id')", // Only creator can see their notebooks
      create: "auth.id != null",
      update: "auth.id == data.ref('creator.id')", // Only creator can update their notebooks
      delete: "auth.id == data.ref('creator.id')", // Only creator can delete their notebooks
    }
  },

  tags: {
    allow: {
      view: "auth.id == data.ref('creator.id')", // Only creator can see their tags
      create: "auth.id != null",
      update: "auth.id == data.ref('creator.id')", // Only creator can update their tags
      delete: "auth.id == data.ref('creator.id')", // Only creator can delete their tags
    }
  }
} satisfies InstantRules;

export default rules;
