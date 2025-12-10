<?php

declare(strict_types=1);

namespace App\Models\Rewards;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RewardUser extends Model
{
    use HasFactory;

    protected $table = 'reward_users';

    protected $fillable = [
        'user_id',
        'level',
        'experience_points',
        'total_points',
        'lifetime_points',
        'current_streak',
        'longest_streak',
        'streak_updated_at',
        'last_activity_at',
        'settings',
    ];

    protected $casts = [
        'level' => 'integer',
        'experience_points' => 'integer',
        'total_points' => 'integer',
        'lifetime_points' => 'integer',
        'current_streak' => 'integer',
        'longest_streak' => 'integer',
        'streak_updated_at' => 'datetime',
        'last_activity_at' => 'datetime',
        'settings' => 'array',
    ];

    protected $attributes = [
        'level' => 1,
        'experience_points' => 0,
        'total_points' => 0,
        'lifetime_points' => 0,
        'current_streak' => 0,
        'longest_streak' => 0,
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Get the user that owns this reward profile
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get user's badges
     */
    public function badges(): HasMany
    {
        return $this->hasMany(RewardUserBadge::class);
    }

    /**
     * Get user's transactions
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(RewardTransaction::class);
    }

    /**
     * Get user's challenge participations
     */
    public function challengeParticipations(): HasMany
    {
        return $this->hasMany(RewardChallengeParticipation::class);
    }

    /**
     * Get user's redemptions
     */
    public function redemptions(): HasMany
    {
        return $this->hasMany(RewardRedemption::class);
    }

    /**
     * Get user's leaderboard entries
     */
    public function leaderboardEntries(): HasMany
    {
        return $this->hasMany(RewardLeaderboardEntry::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    /**
     * Scope to get active users (activity in last X days)
     */
    public function scopeActive($query, int $days = 30)
    {
        return $query->where('last_activity_at', '>=', now()->subDays($days));
    }

    /**
     * Scope to get users with active streaks
     */
    public function scopeWithActiveStreak($query)
    {
        return $query->where('current_streak', '>', 0);
    }

    /**
     * Scope to order by level
     */
    public function scopeByLevel($query, string $direction = 'desc')
    {
        return $query->orderBy('level', $direction)
                     ->orderBy('experience_points', $direction);
    }

    /**
     * Scope to order by points
     */
    public function scopeByPoints($query, string $direction = 'desc')
    {
        return $query->orderBy('total_points', $direction);
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors & Mutators
    |--------------------------------------------------------------------------
    */

    /**
     * Get XP required for next level
     */
    public function getXpForNextLevelAttribute(): int
    {
        $baseXp = config('gamification.levels.base_xp', 100);
        $multiplier = config('gamification.levels.multiplier', 1.5);
        
        return (int) ($baseXp * pow($multiplier, $this->level - 1));
    }

    /**
     * Get XP progress percentage to next level
     */
    public function getLevelProgressAttribute(): float
    {
        $xpForNext = $this->xp_for_next_level;
        
        if ($xpForNext <= 0) {
            return 100;
        }

        return min(100, round(($this->experience_points / $xpForNext) * 100, 2));
    }

    /**
     * Get streak bonus multiplier
     */
    public function getStreakBonusAttribute(): float
    {
        $bonuses = config('gamification.streaks.bonuses', []);
        $bonus = 0;

        foreach ($bonuses as $days => $multiplier) {
            if ($this->current_streak >= $days) {
                $bonus = $multiplier;
            }
        }

        return $bonus;
    }

    /**
     * Get badge count
     */
    public function getBadgeCountAttribute(): int
    {
        return $this->badges()->count();
    }

    /*
    |--------------------------------------------------------------------------
    | Methods
    |--------------------------------------------------------------------------
    */

    /**
     * Check if user has a specific badge
     */
    public function hasBadge(RewardBadge|int $badge): bool
    {
        $badgeId = $badge instanceof RewardBadge ? $badge->id : $badge;
        
        return $this->badges()
            ->where('reward_badge_id', $badgeId)
            ->exists();
    }

    /**
     * Check if user can afford points cost
     */
    public function canAfford(int $points): bool
    {
        return $this->total_points >= $points;
    }

    /**
     * Get or create reward user for a given user
     */
    public static function findOrCreateForUser(User|int $user): self
    {
        $userId = $user instanceof User ? $user->id : $user;

        return self::firstOrCreate(
            ['user_id' => $userId],
            [
                'level' => 1,
                'experience_points' => 0,
                'total_points' => 0,
                'lifetime_points' => 0,
                'current_streak' => 0,
                'longest_streak' => 0,
            ]
        );
    }
}
