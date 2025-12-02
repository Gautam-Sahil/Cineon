import express from "express";
import { addShow, getAllMovies, getNowPlayingMovies, getShow, getShows } from "../controller/showController.js";
import { protectAdmin } from "../middleware/auth.js";



const showRouter = express.Router();

showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies)
showRouter.post('/add', protectAdmin, addShow)
showRouter.get('/all-movies', getAllMovies);
showRouter.get('/all',getShows)
showRouter.get('/:movieId', getShow)

export default showRouter;