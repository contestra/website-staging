export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center">
          <div className="text-2xl font-bold">
            <span className="text-black">AI21</span>
            <span className="text-purple-600">labs</span>
          </div>
        </div>
        <button className="flex flex-col space-y-1">
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </button>
      </header>

      {/* Main Content */}
      <main className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        {/* Left Content */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-12 lg:py-16">
          <div className="w-full max-w-xl">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light mb-8 text-gray-900 leading-tight">
              Building the Future<br />
              of Enterprise AI
            </h1>

            <p className="text-lg lg:text-xl text-gray-600 mb-12 leading-relaxed">
              Automate your most complex and high-<br />
              value workflows with enterprise-grade AI<br />
              you can trust and scale.
            </p>

            {/* Feature Points */}
            <div className="space-y-6 mb-16">
              <div className="flex items-start space-x-4">
                <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center mt-1 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 text-[15px] leading-relaxed">
                  Deploy privately in your VPC or on-prem –<br />
                  without compromising performance.
                </p>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center mt-1 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 text-[15px] leading-relaxed">
                  Deliver accurate, auditable results with built-in<br />
                  validation and traceability.
                </p>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center mt-1 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 text-[15px] leading-relaxed">
                  Purpose-built to scale real enterprise workflows<br />
                  from pilot to production.
                </p>
              </div>
            </div>

            {/* Trusted Partners */}
            <div>
              <p className="text-gray-600 mb-6 text-[15px]">Trusted partner of the world's leading enterprises:</p>
              <div className="flex items-center space-x-8">
                <img src="https://ext.same-assets.com/2594730023/2554997912.webp" alt="Logo" className="h-8 opacity-60" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Form */}
        <div className="relative bg-[#f8f0f4] lg:min-h-full">
          {/* Gradient overlay that creates the pink-purple effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/60 via-pink-200/40 to-purple-300/40"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-purple-400/30 to-transparent"></div>

          <div className="relative p-6 lg:p-16 h-full flex items-center justify-center">
            <div className="w-full max-w-[480px] bg-white rounded-xl shadow-lg p-8 lg:p-10">
              <h2 className="text-[28px] font-normal mb-10 text-gray-900">
                Request a custom demo
              </h2>

              <form className="space-y-7">
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="text-sm text-gray-600 block mb-1">First name*</label>
                    <input
                      type="text"
                      className="w-full border-0 border-b border-gray-300 px-0 py-1 focus:outline-none focus:border-purple-600 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-sm text-gray-600 block mb-1">Last name*</label>
                    <input
                      type="text"
                      className="w-full border-0 border-b border-gray-300 px-0 py-1 focus:outline-none focus:border-purple-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-sm text-gray-600 block mb-1">Work email*</label>
                  <input
                    type="email"
                    className="w-full border-0 border-b border-gray-300 px-0 py-1 focus:outline-none focus:border-purple-600 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="text-sm text-gray-600 block mb-1">Phone number</label>
                    <input
                      type="tel"
                      className="w-full border-0 border-b border-gray-300 px-0 py-1 focus:outline-none focus:border-purple-600 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-sm text-gray-600 block mb-1">Company name*</label>
                    <input
                      type="text"
                      className="w-full border-0 border-b border-gray-300 px-0 py-1 focus:outline-none focus:border-purple-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="text-sm text-gray-600 block mb-1">Job title*</label>
                    <input
                      type="text"
                      className="w-full border-0 border-b border-gray-300 px-0 py-1 focus:outline-none focus:border-purple-600 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-sm text-gray-600 block mb-1">Country</label>
                    <select className="w-full border-0 border-b border-gray-300 px-0 py-1 focus:outline-none focus:border-purple-600 transition-colors bg-transparent appearance-none cursor-pointer">
                      <option value=""></option>
                      <option value="us">United States</option>
                      <option value="uk">United Kingdom</option>
                      <option value="ca">Canada</option>
                      <option value="de">Germany</option>
                      <option value="fr">France</option>
                      <option value="other">Other</option>
                    </select>
                    <svg className="absolute right-0 top-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <label className="text-sm text-gray-600 block mb-1">How can our team help you?</label>
                  <textarea
                    className="w-full border-0 border-b border-gray-300 px-0 py-1 focus:outline-none focus:border-purple-600 transition-colors resize-none"
                    rows={3}
                  ></textarea>
                </div>

                <div className="flex items-center justify-between gap-4 mt-12">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    I acknowledge and accept the terms of the{' '}
                    <a href="#" className="text-purple-600 underline font-semibold">privacy<br />policy</a>.
                  </p>

                  <button
                    type="submit"
                    className="bg-[#2a2a2a] hover:bg-black text-white px-6 py-3 rounded font-medium tracking-wide text-sm inline-flex items-center justify-center group transition-colors whitespace-nowrap"
                  >
                    SUBMIT
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-12 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="text-2xl font-bold">
              <span className="text-black">AI21</span>
              <span className="text-purple-600">labs</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">PRODUCTS</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Maestro</a></li>
                <li><a href="#" className="hover:text-gray-900">Custom AI Systems</a></li>
                <li><a href="#" className="hover:text-gray-900">Models</a></li>
                <li><a href="#" className="hover:text-gray-900">Deployment</a></li>
                <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">DEVELOPERS</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Developer Hub</a></li>
                <li><a href="#" className="hover:text-gray-900">Platform</a></li>
                <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">COMPANY</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Partners</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">RESOURCES</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Resource Center</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Knowledge Hub</a></li>
                <li><a href="#" className="hover:text-gray-900">Glossary</a></li>
                <li><a href="#" className="hover:text-gray-900">What Are AI Agents?</a></li>
                <li><a href="#" className="hover:text-gray-900">What is Private AI?</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">TERMS AND POLICIES</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Terms of Use</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900">Acceptable Use</a></li>
                <li><a href="#" className="hover:text-gray-900">Trust Center</a></li>
                <li><a href="#" className="hover:text-gray-900">VDP</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">STAY UPDATED</h3>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Your Email*"
                  className="text-sm w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600"
                />
                <button
                  className="w-full text-sm border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded transition-colors"
                >
                  SUBSCRIBE →
                </button>
              </div>
              <div className="flex space-x-3 mt-6">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            © All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
