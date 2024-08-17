<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


/**
 * Controlador da página inicial (Landing Page).
 *
 * @author Dr.XGB <https://github.com/drxgb>
 * @version 1.0.0
 */
class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        return $this->view('Home/Index', [
			'canLogin' => Route::has('login'),
			'canRegister' => Route::has('register'),
		]);
    }
}
