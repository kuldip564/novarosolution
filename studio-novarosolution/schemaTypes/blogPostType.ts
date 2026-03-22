import {defineField, defineType} from 'sanity'

export const blogPostType = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(3).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(20).max(260),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 18,
      validation: (rule) => rule.required().min(60),
    }),
    defineField({
      name: 'coverImageUrl',
      title: 'Cover Image URL',
      type: 'url',
      description: 'Optional public image URL for Open Graph and blog cards.',
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      initialValue: 'Novaro Team',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'Used when status is published.',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'authorName',
      status: 'status',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const {title, subtitle, status, publishedAt} = selection
      const dateLabel = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No date'
      return {
        title: title || 'Untitled post',
        subtitle: `${status === 'published' ? 'Published' : 'Draft'} • ${subtitle || 'Unknown author'} • ${dateLabel}`,
      }
    },
  },
})
