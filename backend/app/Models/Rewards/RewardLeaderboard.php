<?php

declare(strict_types=1);

namespace App\Models\Rewards;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RewardLeaderboard extends Model
{
    use HasFactory;

    protected $table = 'reward_leaderboards';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'metric',
        'period',
        'starts_at',
        'ends_at',
        'is_active',
        'settings',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
        'settings' => 'array',
    ];

    protected $attributes = [
        'is_active' => true,
    ];

    /**
     * Available metrics
     */
    public const METRIC_POINTS = 'points';
    public const METRIC_EXPERIENCE = 'experience';
    public const METRIC_STREAK = 'streak';
    public const METRIC_LEVEL = 'level';

    /**
     * Available periods
     */
    public const PERIOD_DAILY = 'daily';
    public const PERIOD_WEEKLY = 'weekly';
    public const PERIOD_MONTHLY = 'monthly';
    public const PERIOD_ALL_TIME = 'all_time';

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Get leaderboard entries
     */
    public function entries(): HasMany
    {
        return $this->hasMany(RewardLeaderboardEntry::class, 'leaderboard_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    /**
     * Scope to get only active leaderboards
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get current leaderboards (within date range)
     */
    public function scopeCurrent($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('starts_at')
              ->orWhere('starts_at', '<=', now());
        })->where(function ($q) {
            $q->whereNull('ends_at')
              ->orWhere('ends_at', '>=', now());
        });
    }

    /**
     * Scope to filter by metric
     */
    public function scopeByMetric($query, string $metric)
    {
        return $query->where('metric', $metric);
    }

    /**
     * Scope to filter by period
     */
    public function scopeByPeriod($query, string $period)
    {
        return $query->where('period', $period);
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    /**
     * Check if leaderboard is currently active
     */
    public function getIsCurrentAttribute(): bool
    {
        $now = now();
        
        $afterStart = !$this->starts_at || $this->starts_at->lte($now);
        $beforeEnd = !$this->ends_at || $this->ends_at->gte($now);
        
        return $this->is_active && $afterStart && $beforeEnd;
    }

    /**
     * Get entry count
     */
    public function getEntryCountAttribute(): int
    {
        return $this->entries()->count();
    }
}
