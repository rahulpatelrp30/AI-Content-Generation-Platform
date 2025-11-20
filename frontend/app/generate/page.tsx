'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { apiClient, GenerateRequest } from '@/lib/api';

type ContentType = 'blog' | 'email' | 'social';
type Tone = 'formal' | 'casual' | 'funny' | 'persuasive';
type Length = 'short' | 'medium' | 'long';

export default function GeneratePage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    contentType: 'blog' as ContentType,
    tone: 'casual' as Tone,
    length: 'medium' as Length,
    product: '',
    audience: '',
    extraInstructions: '',
  });
  
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!token) {
      router.push('/auth/login');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSavedId(null);
    
    try {
      const request: GenerateRequest = {
        content_type: formData.contentType,
        tone: formData.tone,
        length: formData.length,
        product: formData.product,
        audience: formData.audience,
        extra_instructions: formData.extraInstructions || undefined,
      };

      const result = await apiClient.generateContent(request);
      setGeneratedContent(result.generated_content);
      setSavedId(result.id);
    } catch (err: any) {
      setError(err.message || 'Failed to generate content. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setGeneratedContent('');
    setSavedId(null);
    handleSubmit(new Event('submit') as any);
  };

  if (!token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Content Gen
              </h1>
            </a>
            <div className="flex gap-4">
              <a
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </a>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Generate Content</h1>
          <p className="mt-2 text-lg text-gray-600">
            Fill in the details below and let AI create amazing content for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Content Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['blog', 'email', 'social'] as ContentType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, contentType: type })}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        formData.contentType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tone
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value as Tone })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="funny">Funny</option>
                  <option value="persuasive">Persuasive</option>
                </select>
              </div>

              {/* Length */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Length
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['short', 'medium', 'long'] as Length[]).map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => setFormData({ ...formData, length: len })}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        formData.length === len
                          ? 'border-purple-600 bg-purple-50 text-purple-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {len.charAt(0).toUpperCase() + len.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product/Brand */}
              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-900 mb-2">
                  Product / Brand Name
                </label>
                <input
                  type="text"
                  id="product"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder="e.g., AI Resume Analyzer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              {/* Target Audience */}
              <div>
                <label htmlFor="audience" className="block text-sm font-medium text-gray-900 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  id="audience"
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  placeholder="e.g., recent CS graduates"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              {/* Extra Instructions */}
              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-900 mb-2">
                  Additional Instructions (Optional)
                </label>
                <textarea
                  id="instructions"
                  value={formData.extraInstructions}
                  onChange={(e) => setFormData({ ...formData, extraInstructions: e.target.value })}
                  placeholder="Any specific requirements or details..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Content'
                )}
              </button>
            </form>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Generated Content</h2>
              {generatedContent && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleRegenerate}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Regenerate
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {savedId && generatedContent && !isLoading && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">✓ Content saved to your history!</p>
              </div>
            )}

            {!generatedContent && !isLoading && (
              <div className="h-[500px] flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Your generated content will appear here</p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-gray-600">Creating your content...</p>
                </div>
              </div>
            )}

            {generatedContent && !isLoading && (
              <div className="prose max-w-none">
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap font-sans text-gray-800">
                  {generatedContent}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
