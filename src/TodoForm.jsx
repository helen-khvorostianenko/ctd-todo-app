function TodoForm() {
    return (
		<form>
			<label htmlFor="todoTitle">Todo</label>
			<input
			    type="text"
				id="todoTitle"
				name="title"
				placeholder="add a title"
			/>
			<input type="submit" value="Add Todo" />
		</form>
	);
}

export default TodoForm;
