import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Circle, PlusCircle, LogOut } from 'lucide-react';
import { 
  SignIn,  
  useUser, 
  useClerk,
  SignedIn,
  SignedOut
} from '@clerk/clerk-react';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  // Use Clerk's useUser hook to get the current user
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  // Load todos from local storage on initial render
  useEffect(() => {
    if (isSignedIn && user) {
      const userId = user.id;
      const savedTodos = JSON.parse(localStorage.getItem(`todos_${userId}`) || '[]');
      setTodos(savedTodos);
    }
  }, [isSignedIn, user]);

  // Save todos to local storage whenever todos change
  useEffect(() => {
    if (isSignedIn && user) {
      const userId = user.id;
      localStorage.setItem(`todos_${userId}`, JSON.stringify(todos));
    }
  }, [todos, isSignedIn, user]);

  const handleLogout = () => {
    signOut();
  };

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // If still loading, you can show a loading state
  if (!isLoaded) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <SignedIn>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0]}
              </h1>
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 flex items-center"
              >
                <LogOut size={20} className="mr-1" /> Logout
              </button>
            </div>
            
            {/* Input Area */}
            <div className="flex mb-4">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new todo"
                className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={addTodo}
                className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition duration-300"
              >
                <PlusCircle size={24} />
              </button>
            </div>

            {/* Todo List */}
            <div className="space-y-2">
              {todos.map(todo => (
                <div 
                  key={todo.id} 
                  className="flex items-center bg-gray-50 p-3 rounded-md shadow-sm"
                >
                  <button 
                    onClick={() => toggleTodo(todo.id)}
                    className="mr-3"
                  >
                    {todo.completed ? (
                      <CheckCircle className="text-green-500" size={24} />
                    ) : (
                      <Circle className="text-gray-400" size={24} />
                    )}
                  </button>
                  <span 
                    className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                  >
                    {todo.text}
                  </span>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 transition duration-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Todo Count */}
            {todos.length > 0 && (
              <div className="mt-4 text-center text-gray-600">
                {todos.filter(todo => !todo.completed).length} items left
              </div>
            )}
          </div>
        </SignedIn>
        
        <SignedOut>
          <div className="p-6">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Todo App</h1>
              <p className="text-gray-600">Please sign in to manage your todos</p>
            </div>
            <div className="flex justify-center">
              <SignIn redirectUrl="/"/>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Don't have an account? Use the sign up option in Clerk's widget</p>
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}

export default App;