<?php

declare(strict_types=1);

namespace App\Models\Rewards;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RewardChallenge extends Model
{
    use HasFactory;

    protected $table = 'reward_challenges';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'difficulty',
        'icon',
        'image_url',
        'points_reward',
        'xp_reward',
        'badge_reward_id',
        'objectives',
        'requirements',
        'max_participants',
        'starts_at',
        'ends_at',
        'is_active',
        'is_featured',
        'sort_order',
    ];

    protected $casts = [
        'points_reward' => 'integer',
        'xp_reward' => 'integer',
        'badge_reward_id' => 'integer',
        'objectives' => 'array',
        'requirements' => 'array',
        'max_participants' => 'integer',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $attributes = [
        'type' => 'individual',
        'difficulty' => 'medium',
        'points_reward' => 0,
        'xp_reward' => 0,
        'is_active' => true,
        'is_featured' => false,
        'sort_order' => 0,
    ];

    /**
     * Challenge types
     */
    public const TYPE_DAILY = 'daily';
    public const TYPE_WEEKLY = 'weekly';
    public const TYPE_MONTHLY = 'monthly';
    public const TYPE_SPECIAL = 'special';
    public const TYPE_INDIVIDUAL = 'individual';
    public const TYPE_TEAM = 'team';

    /**
     * Difficulty levels
     */
    public const DIFFICULTY_EASY = 'easy';
    public const DIFFICULTY_MEDIUM = 'medium';
    public const DIFFICULTY_HARD = 'hard';
    public const DIFFICULTY_EXPERT = 'expert';

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Get challenge participations
     */
    public function participations(): HasMany
    {
        return $this->hasMany(RewardChallengeParticipation::class, 'challenge_id');
    }

    /**
     * Get badge reward
     */
    public function badgeReward()
    {
        return $this->belongsTo(RewardBadge::class, 'badge_reward_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    /**
     * Scope to get only active challenges
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get featured challenges
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to get current challenges (within date range)
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
     * Scope to filter by type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to filter by difficulty
     */
    public function scopeOfDifficulty($query, string $difficulty)
    {
        return $query->where('difficulty', $difficulty);
    }

    /**
     * Scope to get available challenges (can join)
     */
    public function scopeAvailable($query)
    {
        return $query->active()
            ->current()
            ->where(function ($q) {
                $q->whereNull('max_participants')
                  ->orWhereRaw('(SELECT COUNT(*) FROM reward_challenge_participations WHERE challenge_id = reward_challenges.id) < max_participants');
            });
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    /**
     * Check if challenge is currently active
     */
    public function getIsCurrentAttribute(): bool
    {
        $now = now();
        
        $afterStart = !$this->starts_at || $this->starts_at->lte($now);
        $beforeEnd = !$this->ends_at || $this->ends_at->gte($now);
        
        return $this->is_active && $afterStart && $beforeEnd;
    }

    /**
     * Get participant count
     */
    public function getParticipantCountAttribute(): int
    {
        return $this->participations()->count();
    }

    /**
     * Get completion count
     */
    public function getCompletionCountAttribute(): int
    {
        return $this->participations()->whereNotNull('completed_at')->count();
    }

    /**
     * Check if challenge has spots available
     */
    public function getHasSpotsAttribute(): bool
    {
        if ($this->max_participants === null) {
            return true;
        }
        
        return $this->participant_count < $this->max_participants;
    }

    /**
     * Get remaining time
     */
    public function getRemainingTimeAttribute(): ?int
    {
        if (!$this->ends_at) {
            return null;
        }
        
        return max(0, now()->diffInSeconds($this->ends_at, false));
    }

    /*
    |--------------------------------------------------------------------------
    | Methods
    |--------------------------------------------------------------------------
    */

    /**
     * Check if user is participating
     */
    public function hasParticipant(RewardUser|int $user): bool
    {
        $userId = $user instanceof RewardUser ? $user->id : $user;
        
        return $this->participations()
            ->where('reward_user_id', $userId)
            ->exists();
    }

    /**
     * Get user's participation
     */
    public function getParticipation(RewardUser|int $user): ?RewardChallengeParticipation
    {
        $userId = $user instanceof RewardUser ? $user->id : $user;
        
        return $this->participations()
            ->where('reward_user_id', $userId)
            ->first();
    }
}
