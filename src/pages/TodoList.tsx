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
	const { data, isLoading, mutate } = http.getSwr('/todos');

	// putSwr 更新 todo 狀態
	const { trigger: updateTodo, isMutating } = http.putSwr('/todos');

	if (isLoading || !data) return <Loading />;

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
				{data.slice(0, 7).map((todo: Todo) => (
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
