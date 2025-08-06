import { Button } from "./ui/Button";

export const App = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Tailwind CSS v4 Test
          </h1>
          <p className="text-lg text-gray-600">
            Testing if Tailwind CSS is working properly
          </p>
        </div>

        {/* Color Test */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Color Tests
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-500 text-white p-4 rounded-lg text-center">
              Red 500
            </div>
            <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
              Blue 500
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg text-center">
              Green 500
            </div>
            <div className="bg-purple-500 text-white p-4 rounded-lg text-center">
              Purple 500
            </div>
          </div>
        </div>

        {/* Layout Test */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Layout Tests
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold">Flexbox Test</h3>
              <p className="text-sm text-gray-600">This should be responsive</p>
            </div>
            <div className="flex-1 bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold">Grid Test</h3>
              <p className="text-sm text-gray-600">Responsive layout</p>
            </div>
          </div>
        </div>

        {/* Button Tests */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Button Tests
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => alert("Hej!")}>Standard Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button disabled>Disabled Button</Button>
          </div>
        </div>

        {/* Typography Test */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Typography Tests
          </h2>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Extra small text (text-xs)</p>
            <p className="text-sm text-gray-600">Small text (text-sm)</p>
            <p className="text-base text-gray-700">Base text (text-base)</p>
            <p className="text-lg text-gray-800">Large text (text-lg)</p>
            <p className="text-xl font-semibold text-gray-900">
              Extra large text (text-xl)
            </p>
          </div>
        </div>

        {/* Spacing Test */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Spacing Tests
          </h2>
          <div className="space-y-4">
            <div className="bg-blue-100 p-2 rounded">Padding 2 (p-2)</div>
            <div className="bg-blue-200 p-4 rounded">Padding 4 (p-4)</div>
            <div className="bg-blue-300 p-6 rounded">Padding 6 (p-6)</div>
          </div>
        </div>
      </div>
    </main>
  );
};
