import React, { useState } from 'react';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { CHAT_FAQS } from '../components/chatbot/chatFaq';
import { Button } from '../components/ui/Button';
import {
  Edit2,
  MessageSquare,
  Plus,
  Save,
  Search,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
} from 'lucide-react';

const CATEGORIES = [...new Set(CHAT_FAQS.map((faq) => faq.category))];

const FEEDBACK = [
  {
    id: 1,
    user: 'Tourist User',
    type: 'positive',
    comment: 'The chatbot explained the booking steps clearly.',
    date: '2h ago',
  },
  {
    id: 2,
    user: 'Artist User',
    type: 'negative',
    comment: 'It should also mention profile verification in more answers.',
    date: '1d ago',
  },
  {
    id: 3,
    user: 'Admin User',
    type: 'positive',
    comment: 'The FAQ now feels aligned with the actual platform features.',
    date: '2d ago',
  },
];

export function ChatAdmin() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0] || 'General');
  const [faqs, setFaqs] = useState(
    CHAT_FAQS.map((faq, index) => ({
      id: index + 1,
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
    }))
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
  });

  const filteredFaqs = faqs.filter((faq) => faq.category === selectedCategory);

  const handleAddFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFaqs([
        ...faqs,
        {
          id: Date.now(),
          category: selectedCategory,
          ...newFaq,
        },
      ]);
      setNewFaq({ question: '', answer: '' });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: number) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  return (
    <div className="min-h-screen bg-offwhite font-body">
      <Navbar />

      <main className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="font-display mb-2 text-4xl font-black text-forest">Knowledge Base</h1>
              <p className="text-gray-600">Manage Lanka Crafts chatbot FAQs and review recent feedback.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" /> View Logs
              </Button>
              <Button variant="primary" className="gap-2" onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4" /> Add New FAQ
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-gray-50 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">Categories</h3>
                </div>
                <div className="p-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-forest text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-gray-50 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">Recent Feedback</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {FEEDBACK.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">{item.user}</span>
                        <span className="text-[10px] text-gray-400">{item.date}</span>
                      </div>
                      <p className="mb-2 text-sm text-gray-600">{item.comment}</p>
                      <div
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${item.type === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {item.type === 'positive' ? <ThumbsUp className="h-3 w-3" /> : <ThumbsDown className="h-3 w-3" />}
                        {item.type === 'positive' ? 'Helpful' : 'Needs work'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-3">
              {isAdding && (
                <div className="animate-in slide-in-from-top-4 fade-in rounded-2xl border border-mustard/30 bg-white p-6 shadow-md">
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="font-bold text-forest">Add New FAQ to {selectedCategory}</h3>
                    <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Question</label>
                      <input
                        type="text"
                        value={newFaq.question}
                        onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-forest focus:outline-none"
                        placeholder="e.g. How do I contact an artist before booking?"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Answer</label>
                      <textarea
                        rows={3}
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                        className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 focus:border-forest focus:outline-none"
                        placeholder="Enter the chatbot response..."
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setIsAdding(false)}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleAddFaq} className="gap-2">
                        <Save className="h-4 w-4" /> Save FAQ
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={selectedCategory}
                    readOnly
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredFaqs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center">
                    <p className="text-gray-400">No FAQs found for this category.</p>
                    <button onClick={() => setIsAdding(true)} className="mt-2 text-sm font-bold text-forest hover:underline">
                      Add the first one
                    </button>
                  </div>
                ) : (
                  filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="mb-2 font-bold text-gray-900">{faq.question}</h4>
                          <p className="text-sm leading-relaxed text-gray-600">{faq.answer}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-forest/5 hover:text-forest">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(faq.id)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
