import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import GamesRoute from '@/routes/games.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new GamesRoute(), new UsersRoute(), new AuthRoute()]);

app.listen();
