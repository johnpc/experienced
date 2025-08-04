'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

interface RichTextRendererProps {
  content: string;
  className?: string;
  enableTOC?: boolean;
  maxWidth?: 'none' | 'prose' | 'full';
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function RichTextRenderer({
  content,
  className = '',
  enableTOC = false,
  maxWidth = 'prose',
}: RichTextRendererProps) {
  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Parse content and generate HTML
  const rawHTML = marked(content, { async: false }) as string;
  const sanitizedHTML = DOMPurify.sanitize(rawHTML);

  // Extract headings for TOC
  const extractTOC = (html: string): TOCItem[] => {
    const headingRegex = /<h([1-6])\s+id="([^"]+)"[^>]*>([^<]+)<\/h[1-6]>/g;
    const toc: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(html)) !== null) {
      toc.push({
        id: match[2],
        text: match[3],
        level: parseInt(match[1]),
      });
    }

    return toc;
  };

  const tocItems = enableTOC ? extractTOC(sanitizedHTML) : [];

  const getMaxWidthClasses = () => {
    switch (maxWidth) {
      case 'none':
        return '';
      case 'prose':
        return 'max-w-4xl mx-auto';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-4xl mx-auto';
    }
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`rich-text-container ${getMaxWidthClasses()} ${className}`}>
      {/* Table of Contents */}
      {enableTOC && tocItems.length > 0 && (
        <div className="toc-container mb-8 rounded-lg border bg-gray-50 p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Table of Contents
          </h3>
          <nav className="toc-nav">
            <ul className="space-y-1">
              {tocItems.map((item, index) => (
                <li key={index} className={`toc-item toc-level-${item.level}`}>
                  <button
                    onClick={() => scrollToHeading(item.id)}
                    className={`text-left transition-colors duration-200 hover:text-primary-600 ${
                      item.level === 1
                        ? 'font-semibold text-gray-900'
                        : item.level === 2
                          ? 'ml-4 font-medium text-gray-800'
                          : 'ml-8 text-gray-700'
                    }`}
                  >
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Rich Text Content */}
      <div
        className="prose prose-lg prose-gray prose-headings:text-gray-900
          prose-headings:font-bold prose-h1:text-3xl
          prose-h1:mb-6 prose-h1:mt-8 prose-h2:text-2xl
          prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h3:text-xl
          prose-h3:mb-3 prose-h3:mt-5 prose-h4:text-lg
          prose-h4:mb-2 prose-h4:mt-4 prose-p:text-gray-700
          prose-p:leading-relaxed prose-p:mb-4 prose-a:text-primary-600
          prose-a:no-underline hover:prose-a:text-primary-700 hover:prose-a:underline prose-strong:text-gray-900
          prose-strong:font-semibold prose-em:text-gray-800
          prose-ul:my-4
          prose-ul:space-y-2 prose-ol:my-4
          prose-ol:space-y-2 prose-li:text-gray-700
          prose-blockquote:border-l-4
          prose-blockquote:border-primary-200 prose-blockquote:bg-primary-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:my-6 prose-blockquote:text-primary-800
          prose-blockquote:font-medium prose-blockquote:italic prose-code:bg-gray-100
          prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-gray-800 prose-pre:bg-gray-900
          prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-table:w-full
          prose-table:border-collapse prose-th:border
          prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-td:border
          prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 prose-img:rounded-lg
          prose-img:shadow-md prose-img:my-6 max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
    </div>
  );
}
