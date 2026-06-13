"use client";

import { z } from "zod";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";

const schema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  published: z.boolean().default(true),
});

export default function AdminFaqPage() {
  return (
    <AdminCrudPage
      title="FAQ"
      subtitle="Questions and answers shown on the site FAQ sections."
      endpoint="faq"
      schema={schema}
      wideDrawer
      defaultValues={{ question: "", answer: "", published: true }}
      columns={[
        { key: "question", label: "Question" },
      ]}
      renderFields={(form) => (
        <>
          <fieldset className="admin-form-section">
            <legend>FAQ item</legend>
            <label className="admin-field">
              <span>Question</span>
              <input {...form.register("question")} />
            </label>
            <label className="admin-field">
              <span>Answer</span>
              <textarea {...form.register("answer")} rows={6} />
            </label>
            <label className="admin-field admin-checkbox">
              <input type="checkbox" {...form.register("published")} />
              <span>Published on public site</span>
            </label>
          </fieldset>
        </>
      )}
    />
  );
}
