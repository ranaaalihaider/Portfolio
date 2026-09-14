<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    public static function bootLogsActivity()
    {
        static::created(function ($model) {
            self::logAction($model, 'created');
        });

        static::updated(function ($model) {
            self::logAction($model, 'updated');
        });

        static::deleted(function ($model) {
            self::logAction($model, 'deleted');
        });
    }

    protected static function logAction($model, $action)
    {
        $user = Auth::user();
        if (!$user) {
            return;
        }

        $changes = [];
        if ($action === 'updated') {
            $changes = [
                'old' => array_intersect_key($model->getOriginal(), $model->getChanges()),
                'new' => $model->getChanges(),
            ];
        } elseif ($action === 'created') {
            $changes = [
                'new' => $model->getAttributes(),
            ];
        } elseif ($action === 'deleted') {
            $changes = [
                'old' => $model->getAttributes(),
            ];
        }

        try {
            ActivityLog::create([
                'user_id' => $user->id,
                'user_name' => $user->name,
                'role' => $user->role,
                'action' => $action,
                'model_type' => class_basename($model),
                'model_id' => $model->id,
                'changes' => $changes,
            ]);
        } catch (\Exception $e) {
            // Silently catch the error so the main application flow (like booking a trip) doesn't crash
            \Illuminate\Support\Facades\Log::error('Failed to log activity: ' . $e->getMessage());
        }
    }
}
