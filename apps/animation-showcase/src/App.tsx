import React from 'react';
import './App.css';
import ButtonExample from './components/ButtonExample';

const App: React.FC = () => {

  return (
    <div className="app">
      <header className="app-header">
        <h1>Button Animation Challenge</h1>
      </header>

      <main className="app-content">
        <section className="challenge-description">
          <h2>Challenge Requirements</h2>
          <p>
            Create a reusable button component that replicates the animation shown in the example.
          </p>
          
        </section>

        <section className="examples-section">
          <h2>Create this button</h2>
          <ButtonExample />
        </section>

        <section className="your-solution">
          <h2>Your Solution</h2>
          <p>Implement your animated button component and showcase it below:</p>
          <div className="solution-demo">
            {/* Replace this comment with your AnimatedButton component */}
            <div className="placeholder-button">Your button will go here</div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Button Animation Challenge &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App; 