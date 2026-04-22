import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  Plus,
  Edit2,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Search,
  Save,
  X
} from
  'lucide-react';
import { Button } from '../components/ui/Button';
const CATEGORIES = [
  'General',
  'Pottery',
  'Textiles',
  'Wood Crafts',
  'Brasswork'];

const MOCK_FAQS = [
  {
    id: 1,
    category: 'Pottery',
    question: 'Where can I find pottery workshops?',
    answer:
      'Kandy and Kelaniya are the best regions for traditional pottery workshops.'
  },
  {
    id: 2,
    category: 'Textiles',
    question: 'How is Batik made?',
    answer: 'Batik is a wax-resist dyeing technique applied to whole cloth.'
  },
  {
    id: 3,
    category: 'General',
    question: 'How do I book a workshop?',
    answer:
      'You can book directly through the artist profile page or contact them via chat.'
  }];

const FEEDBACK = [
  {
    id: 1,
    user: 'Sarah M.',
    type: 'positive',
    comment: 'Very helpful for finding local gems!',
    date: '2h ago'
  },
  {
    id: 2,
    user: 'John D.',
    type: 'negative',
    comment: 'Map location was slightly off.',
    date: '1d ago'
  },
  {
    id: 3,
    user: 'Emily R.',
    type: 'positive',
    comment: 'Loved the quick responses.',
    date: '2d ago'
  }];

export function ChatAdmin() {
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [faqs, setFaqs] = useState(MOCK_FAQS);
  const [isAdding, setIsAdding] = useState(false);
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: ''
  });
  const filteredFaqs = faqs.filter((faq) => faq.category === selectedCategory);
  const handleAddFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFaqs([
        ...faqs,
        {
          id: Date.now(),
          category: selectedCategory,
          ...newFaq
        }]
      );
      setNewFaq({
        question: '',
        answer: ''
      });
      setIsAdding(false);
    }
  };
  const handleDelete = (id: number) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };
  return (
    <div className="min-h-screen bg-offwhite font-body">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-black text-forest mb-2 font-display">
                Knowledge Base
              </h1>
              <p className="text-gray-600">
                Manage chatbot responses and view user feedback.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="w-4 h-4" /> View Logs
              </Button>
              <Button
                variant="primary"
                className="gap-2"
                onClick={() => setIsAdding(true)}>

                <Plus className="w-4 h-4" /> Add New FAQ
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">
                    Categories
                  </h3>
                </div>
                <div className="p-2">
                  {CATEGORIES.map((cat) =>
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-forest text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>

                      {cat}
                    </button>
                  )}
                </div>
              </div>

              {/* Feedback Summary */}
              <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">
                    Recent Feedback
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {FEEDBACK.map((item) =>
                    <div key={item.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-900">
                          {item.user}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.comment}
                      </p>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${item.type === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>

                        {item.type === 'positive' ?
                          <ThumbsUp className="w-3 h-3" /> :

                          <ThumbsDown className="w-3 h-3" />
                        }
                        {item.type === 'positive' ? 'Helpful' : 'Not Helpful'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Add New Form */}
              {isAdding &&
                <div className="bg-white p-6 rounded-2xl shadow-md border border-mustard/30 animate-in fade-in slide-in-from-top-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-forest">
                      Add New FAQ to {selectedCategory}
                    </h3>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="text-gray-400 hover:text-gray-600">

                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={newFaq.question}
                        onChange={(e) =>
                          setNewFaq({
                            ...newFaq,
                            question: e.target.value
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-forest"
                        placeholder="e.g. What are the opening hours?" />

                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Answer
                      </label>
                      <textarea
                        rows={3}
                        value={newFaq.answer}
                        onChange={(e) =>
                          setNewFaq({
                            ...newFaq,
                            answer: e.target.value
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-forest resize-none"
                        placeholder="Enter the bot's response..." />

                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setIsAdding(false)}>

                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleAddFaq}
                        className="gap-2">

                        <Save className="w-4 h-4" /> Save FAQ
                      </Button>
                    </div>
                  </div>
                </div>
              }

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFaqs.length === 0 ?
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400">
                      No FAQs found for this category.
                    </p>
                    <button
                      onClick={() => setIsAdding(true)}
                      className="text-forest font-bold text-sm mt-2 hover:underline">

                      Add the first one
                    </button>
                  </div> :

                  filteredFaqs.map((faq) =>
                    <div
                      key={faq.id}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">

                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-2">
                            {faq.question}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(faq.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">

                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>);

}