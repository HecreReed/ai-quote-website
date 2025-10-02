import QuotationForm from './components/QuotationForm';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">AI智能报价系统</h1>
            <p className="mt-2 text-gray-600">为留学生提供专业的学术服务报价</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuotationForm />
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>&copy; 2024 AI智能报价系统. 专为留学生服务.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
