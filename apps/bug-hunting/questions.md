# Bug Hunting Challenge - Questions

Please answer the following questions about the bugs you identified and fixed:

1. **Bug Overview**: List the bugs you found and fixed. For each bug, briefly describe:

   - What was the issue?
   - How did you identify it?
   - How did you fix it?

     - useState(null) → useState([])
     - setTodos(todos) mutates the old state -> setTodos([...todos, newTodo]).
     - addTodo didn't set an id -> id: Date.now()
     - deleteTodo didn't accept the id parameter.
     - TodoForm didn't receive onAdd as props.
     - TodoFilter didn't receive onFilter as props.

2. **Technical Approach**: What debugging tools and techniques did you use to identify and fix the bugs?

3. **Code Improvements**: Beyond fixing bugs, did you make any improvements to the code organization or structure? If so, what and why?

4. **Future Prevention**: How would you prevent similar bugs in future development? Consider both coding practices and testing strategies.

5. **Learning**: What was the most challenging or interesting aspect of this bug-hunting exercise?
