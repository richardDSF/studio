<?php

declare(strict_types=1);

namespace App\Models\Rewards;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RewardUserBadge extends Model
{
    use HasFactory;

    protected $table = 'reward_user_badges';

    public $timestamps = false;

    protected $fillable = [
        'reward_user_id',
        'reward_badge_id',
        'earned_at',
        'context',
    ];

    protected $casts = [
        'reward_user_id' => 'integer',
        'reward_badge_id' => 'integer',
        'earned_at' => 'datetime',
        'context' => 'array',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Get the reward user
     */
    public function rewardUser(): BelongsTo
    {
        return $this->belongsTo(RewardUser::class);
    }

    /**
     * Get the badge
     */
    public function badge(): BelongsTo
    {
        return $this->belongsTo(RewardBadge::class, 'reward_badge_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    /**
     * Scope to get recent badges
     */
    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('earned_at', '>=', now()->subDays($days));
    }

    /**
     * Scope to order by earned date
     */
    public function scopeLatest($query)
    {
        return $query->orderByDesc('earned_at');
    }

    /*
    |--------------------------------------------------------------------------
    | Boot
    |--------------------------------------------------------------------------
    */

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->earned_at) {
                $model->earned_at = now();
            }
        });
    }
}
