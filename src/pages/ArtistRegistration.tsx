import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Upload, Plus } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
export function ArtistRegistration() {
  const [step, setStep] = useState(1);
  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    email: '',
    password: '',
    username: '',
    // Step 2
    craftType: '',
    bio: '',
    region: '',
    // Step 3 (Availability)
    availability: {
      Mon: {
        morning: false,
        afternoon: false,
        evening: false
      },
      Tue: {
        morning: false,
        afternoon: false,
        evening: false
      },
      Wed: {
        morning: false,
        afternoon: false,
        evening: false
      },
      Thu: {
        morning: false,
        afternoon: false,
        evening: false
      },
      Fri: {
        morning: false,
        afternoon: false,
        evening: false
      },
      Sat: {
        morning: false,
        afternoon: false,
        evening: false
      }
    },
    // Step 4
    listings: [
    {
      name: '',
      price: '',
      description: ''
    }]

  });
  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  return (
    <div className="min-h-screen bg-offwhite font-body flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-forest mb-4 font-display">
              Join the Artisan Community
            </h1>
            <p className="text-gray-600">
              Share your craft with the world in 4 simple steps.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-mustard -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: `${(step - 1) / 3 * 100}%`
              }} />

            <div className="relative z-10 flex justify-between">
              {[1, 2, 3, 4].map((s) =>
              <div
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${s <= step ? 'bg-mustard text-forest shadow-lg scale-110' : 'bg-gray-200 text-gray-500'}`}>

                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
              )}
            </div>
          </div>

          {/* Form Card */}
          <motion.div
            key={step}
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -20
            }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">

            {/* Step 1: Account */}
            {step === 1 &&
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-forest font-display mb-6">
                  Create your Account
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard focus:border-transparent outline-none"
                    placeholder="you@example.com" />

                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard focus:border-transparent outline-none"
                    placeholder="Choose a username" />

                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard focus:border-transparent outline-none"
                    placeholder="••••••••" />

                  </div>
                </div>
              </div>
            }

            {/* Step 2: Profile */}
            {step === 2 &&
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-forest font-display mb-6">
                  Your Craft Profile
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Craft Type
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none bg-white">
                      <option>Select a craft...</option>
                      <option>Batik</option>
                      <option>Lacquerwork</option>
                      <option>Wood Carving</option>
                      <option>Pottery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Region
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none bg-white">
                      <option>Select a region...</option>
                      <option>Kandy</option>
                      <option>Galle</option>
                      <option>Colombo</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Bio / Story
                    </label>
                    <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none resize-none"
                    placeholder="Tell us about your history with the craft..." />

                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Profile Photo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 font-medium">
                        Click to upload photo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }

            {/* Step 3: Availability */}
            {step === 3 &&
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-forest font-display mb-6">
                  Workshop Availability
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Select the times you are available to host workshops.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr>
                        <th className="text-left pb-4 text-gray-400 font-medium text-sm">
                          Day
                        </th>
                        <th className="pb-4 text-gray-600 font-bold text-sm">
                          Morning
                        </th>
                        <th className="pb-4 text-gray-600 font-bold text-sm">
                          Afternoon
                        </th>
                        <th className="pb-4 text-gray-600 font-bold text-sm">
                          Evening
                        </th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) =>
                    <tr
                      key={day}
                      className="border-b border-gray-50 last:border-0">

                          <td className="py-3 font-bold text-forest">{day}</td>
                          {['morning', 'afternoon', 'evening'].map((slot) =>
                      <td key={slot} className="py-3 text-center">
                              <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-mustard focus:ring-mustard" />

                            </td>
                      )}
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
            }

            {/* Step 4: Listings */}
            {step === 4 &&
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-forest font-display mb-6">
                  Add Craft Listings
                </h2>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-4 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Item Name
                      </label>
                      <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200"
                      placeholder="e.g. Hand-carved Mask" />

                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Price (LKR)
                      </label>
                      <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200"
                      placeholder="5000" />

                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Description
                      </label>
                      <textarea
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200"
                      placeholder="Short description..." />

                    </div>
                  </div>
                </div>

                <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Add Another Item
                </button>
              </div>
            }

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
              {step > 1 ?
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-gray-500 font-bold hover:text-forest transition-colors">

                  <ChevronLeft className="w-5 h-5" /> Back
                </button> :

              <div />
              }

              <Button
                onClick={step === 4 ? () => console.log('Submit') : nextStep}
                className="px-8">

                {step === 4 ? 'Complete Registration' : 'Continue'}
                {step < 4 && <ChevronRight className="w-5 h-5 ml-2" />}
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>);

}