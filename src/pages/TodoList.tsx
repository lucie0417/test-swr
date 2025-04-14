import { useHttp } from '../hooks/useHttp';
import Loading from '../components/Loading';
import {
	List,
	ListItem,
	ListItemText,
	Typography,
	Button,
	Box,
} from '@mui/material';

interface Todo {
	id: number;
	title: string;
	completed: boolean;
}

const TodoList = () => {
	const http = useHttp();
	const { data: todos, isLoading: loadingTodos, mutate } = http.getSwr('/todos');
	const { data: users, isLoading: loadingUsers } = http.getSwr('/users');
	const { data: comments, isLoading: loadingComments } = http.getSwr('/comments');

	// postSwr 更新狀態(由trigger觸發)
	const { trigger: updateTodo, isMutating } = http.postSwr('/todos');
	console.log('updateTodo trigger', updateTodo);


	if (loadingTodos || loadingUsers || loadingComments) return <Loading />;

	const handleToggle = async (todo: Todo) => {

		console.log('todo', todo);
		await updateTodo({
			id: todo.id,
			title: 'test update!!!!',
			completed: !todo.completed,
		});

		// mutate(); // 重新呼叫API
	};

	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				📝 待辦事項
			</Typography>

			<List>
				{todos.slice(0, 7).map((todo: Todo) => (
					<ListItem
						key={todo.id}
						sx={{
							backgroundColor: todo.completed ? '#2e7d32' : '#616161',
							color: '#fff',
							display: 'flex',
						}}
					>
						<ListItemText
							primary={todo.id}
							sx={{
								width: '20px',
							}}
						/>
						<ListItemText
							primary={todo.title}
							secondary={todo.completed ? '✔️ 已完成' : '⌛ 未完成'}
						/>
						<Button
							variant="outlined"
							color="inherit"
							size="small"
							disabled={isMutating}
							onClick={() => handleToggle(todo)}
						>
							切換狀態
						</Button>
					</ListItem>
				))}
			</List>
		</Box >
	);
};

export default TodoList;
