<?php

declare(strict_types=1);

namespace App\Models\Rewards;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RewardBadge extends Model
{
    use HasFactory;

    protected $table = 'reward_badges';

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'icon',
        'image_url',
        'rarity',
        'points_reward',
        'xp_reward',
        'criteria_type',
        'criteria_config',
        'is_secret',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'category_id' => 'integer',
        'points_reward' => 'integer',
        'xp_reward' => 'integer',
        'criteria_config' => 'array',
        'is_secret' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $attributes = [
        'rarity' => 'common',
        'points_reward' => 0,
        'xp_reward' => 0,
        'is_secret' => false,
        'is_active' => true,
        'sort_order' => 0,
    ];

    /**
     * Badge rarity levels
     */
    public const RARITY_COMMON = 'common';
    public const RARITY_UNCOMMON = 'uncommon';
    public const RARITY_RARE = 'rare';
    public const RARITY_EPIC = 'epic';
    public const RARITY_LEGENDARY = 'legendary';

    public const RARITIES = [
        self::RARITY_COMMON,
        self::RARITY_UNCOMMON,
        self::RARITY_RARE,
        self::RARITY_EPIC,
        self::RARITY_LEGENDARY,
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Get badge category
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(RewardBadgeCategory::class, 'category_id');
    }

    /**
     * Get users who have this badge
     */
    public function userBadges(): HasMany
    {
        return $this->hasMany(RewardUserBadge::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    /**
     * Scope to get only active badges
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only visible (non-secret) badges
     */
    public function scopeVisible($query)
    {
        return $query->where('is_secret', false);
    }

    /**
     * Scope to filter by rarity
     */
    public function scopeByRarity($query, string $rarity)
    {
        return $query->where('rarity', $rarity);
    }

    /**
     * Scope to filter by criteria type
     */
    public function scopeByCriteriaType($query, string $type)
    {
        return $query->where('criteria_type', $type);
    }

    /**
     * Scope to order by sort order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    /**
     * Get users count who earned this badge
     */
    public function getEarnedCountAttribute(): int
    {
        return $this->userBadges()->count();
    }

    /**
     * Get rarity display name
     */
    public function getRarityLabelAttribute(): string
    {
        return ucfirst($this->rarity);
    }

    /**
     * Get rarity color for UI
     */
    public function getRarityColorAttribute(): string
    {
        return match ($this->rarity) {
            self::RARITY_COMMON => '#9ca3af',      // gray
            self::RARITY_UNCOMMON => '#22c55e',    // green
            self::RARITY_RARE => '#3b82f6',        // blue
            self::RARITY_EPIC => '#a855f7',        // purple
            self::RARITY_LEGENDARY => '#f59e0b',   // amber
            default => '#9ca3af',
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Methods
    |--------------------------------------------------------------------------
    */

    /**
     * Get criteria configuration value
     */
    public function getCriteriaValue(string $key, mixed $default = null): mixed
    {
        return data_get($this->criteria_config, $key, $default);
    }

    /**
     * Check if badge has been earned by user
     */
    public function isEarnedBy(RewardUser|int $user): bool
    {
        $userId = $user instanceof RewardUser ? $user->id : $user;
        
        return $this->userBadges()
            ->where('reward_user_id', $userId)
            ->exists();
    }
}
