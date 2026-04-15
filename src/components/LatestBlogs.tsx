import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CalendarIcon, UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
export function LatestBlogs() {
  return (
    <section
      className="py-24 px-6"
      style={{
        backgroundColor: '#F6F3EE'
      }}>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.5
          }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">

          <div>
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{
                backgroundColor: '#C9A227',
                color: '#2F5D50'
              }}>

              ✨ From the Community
            </span>
            <h2
              className="text-4xl md:text-5xl font-black leading-tight"
              style={{
                fontFamily: 'Fraunces, serif',
                color: '#2F5D50'
              }}>

              Latest Stories &<br />
              <span
                style={{
                  color: '#C65D3B'
                }}>

                Travel Journals
              </span>
            </h2>
          </div>
          <Link
            to="/tourist/blogs"
            className="flex items-center gap-2 text-sm font-bold transition-all hover:gap-3 shrink-0"
            style={{
              color: '#2F5D50'
            }}>

            View All Stories <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blog Card 1 */}
          <motion.article
            initial={{
              opacity: 0,
              y: 24
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5,
              delay: 0.1
            }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group">

            <div className="relative overflow-hidden h-56">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
                alt="Batik textile workshop in Kandy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span
                className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full text-white"
                style={{
                  backgroundColor: '#C65D3B'
                }}>

                Craft Experience
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 font-body">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" /> Feb 12, 2025
                </span>
                <span className="flex items-center gap-1">
                  <UserIcon className="w-3 h-3" /> Arjun Mehta
                </span>
              </div>
              <h3
                className="text-xl font-bold mb-2 leading-snug group-hover:text-terracotta transition-colors"
                style={{
                  fontFamily: 'Fraunces, serif',
                  color: '#2F5D50'
                }}>

                A Morning with Batik Masters in Kandy
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 font-body">
                I never expected a two-hour workshop to change how I see fabric
                forever. The wax, the dye, the patience — every step felt like a
                meditation on Sri Lankan heritage.
              </p>
              <Link
                to="/tourist/blogs"
                className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-3"
                style={{
                  color: '#C65D3B'
                }}>

                Read More <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </motion.article>

          {/* Blog Card 2 */}
          <motion.article
            initial={{
              opacity: 0,
              y: 24
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group">

            <div className="relative overflow-hidden h-56">
              <img
                src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&auto=format&fit=crop"
                alt="Pottery workshop Sri Lanka"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span
                className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full text-white"
                style={{
                  backgroundColor: '#2F5D50'
                }}>

                Workshop Review
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 font-body">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" /> Jan 28, 2025
                </span>
                <span className="flex items-center gap-1">
                  <UserIcon className="w-3 h-3" /> Sofia Reyes
                </span>
              </div>
              <h3
                className="text-xl font-bold mb-2 leading-snug group-hover:text-terracotta transition-colors"
                style={{
                  fontFamily: 'Fraunces, serif',
                  color: '#2F5D50'
                }}>

                Shaping Clay at Rohan's Kelaniya Studio
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 font-body">
                Rohan's hands moved like water over the spinning wheel. Three
                hours later, I had a lopsided bowl and the biggest smile of my
                trip. Pottery is humbling and beautiful.
              </p>
              <Link
                to="/tourist/blogs"
                className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-3"
                style={{
                  color: '#C65D3B'
                }}>

                Read More <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </motion.article>

          {/* Blog Card 3 */}
          <motion.article
            initial={{
              opacity: 0,
              y: 24
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5,
              delay: 0.3
            }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group">

            <div className="relative overflow-hidden h-56">
              <img
                src="https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&auto=format&fit=crop"
                alt="Traditional mask carving Ambalangoda"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span
                className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full text-white"
                style={{
                  backgroundColor: '#C9A227',
                  color: '#2F5D50'
                }}>

                Cultural Journey
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 font-body">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" /> Jan 15, 2025
                </span>
                <span className="flex items-center gap-1">
                  <UserIcon className="w-3 h-3" /> Kenji Tanaka
                </span>
              </div>
              <h3
                className="text-xl font-bold mb-2 leading-snug group-hover:text-terracotta transition-colors"
                style={{
                  fontFamily: 'Fraunces, serif',
                  color: '#2F5D50'
                }}>

                The Ancient Masks of Ambalangoda
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 font-body">
                Suresh explained each mask's spirit before carving began. The
                kolam tradition is not just art — it's a living ritual that has
                protected communities for centuries.
              </p>
              <Link
                to="/tourist/blogs"
                className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-3"
                style={{
                  color: '#C65D3B'
                }}>

                Read More <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </motion.article>
        </div>

        {/* Featured Wide Card */}
        <motion.article
          initial={{
            opacity: 0,
            y: 24
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.5,
            delay: 0.4
          }}
          className="mt-8 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col md:flex-row">

          <div className="relative overflow-hidden md:w-2/5 h-64 md:h-auto">
            <img
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop"
              alt="Sri Lankan weaving tradition"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
            <span
              className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{
                backgroundColor: '#C65D3B'
              }}>

              Editor's Pick
            </span>
          </div>
          <div className="flex-1 p-8 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-body">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" /> Feb 20, 2025
              </span>
              <span className="flex items-center gap-1">
                <UserIcon className="w-3 h-3" /> Priya Nair
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: '#F6F3EE',
                  color: '#2F5D50'
                }}>

                8 min read
              </span>
            </div>
            <h3
              className="text-2xl md:text-3xl font-black mb-3 leading-snug group-hover:text-terracotta transition-colors"
              style={{
                fontFamily: 'Fraunces, serif',
                color: '#2F5D50'
              }}>

              How Palmyra Weaving Survived Centuries in Jaffna
            </h3>
            <p className="text-gray-500 leading-relaxed mb-6 font-body max-w-xl">
              Priya Rajapaksa's workshop sits at the edge of a palmyra grove.
              For three generations, her family has transformed these humble
              palm leaves into objects of extraordinary beauty — baskets, fans,
              and mats that carry the soul of the north.
            </p>
            <Link
              to="/tourist/blogs"
              className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-3 w-fit"
              style={{
                color: '#C65D3B'
              }}>

              Read Full Story <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </motion.article>
      </div>
    </section>);

}