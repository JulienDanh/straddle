import React, { useState } from "react";
import { ConfigForm } from "./components/ConfigForm";
import SolverView from "./components/SolverView";

const App = () => {
  const [solverId, setSolverId] = useState<string | null>(null);

  return (
    <div className="app">
      {solverId ? (
        <SolverView id={solverId} onExit={() => setSolverId(null)} />
      ) : (
        <ConfigForm onCreated={setSolverId} />
      )}
    </div>
  );
};

export default App;