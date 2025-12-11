<?php

declare(strict_types=1);

namespace App\Models\Rewards;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RewardLeaderboardEntry extends Model
{
    use HasFactory;

    protected $table = 'reward_leaderboard_entries';

    protected $fillable = [
        'leaderboard_id',
        'reward_user_id',
        'rank',
        'score',
        'previous_rank',
        'snapshot_data',
    ];

    protected $casts = [
        'leaderboard_id' => 'integer',
        'reward_user_id' => 'integer',
        'rank' => 'integer',
        'score' => 'integer',
        'previous_rank' => 'integer',
        'snapshot_data' => 'array',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Get the leaderboard
     */
    public function leaderboard(): BelongsTo
    {
        return $this->belongsTo(RewardLeaderboard::class, 'leaderboard_id');
    }

    /**
     * Get the reward user
     */
    public function rewardUser(): BelongsTo
    {
        return $this->belongsTo(RewardUser::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    /**
     * Scope to order by rank
     */
    public function scopeByRank($query)
    {
        return $query->orderBy('rank');
    }

    /**
     * Scope to get top N entries
     */
    public function scopeTop($query, int $limit = 10)
    {
        return $query->orderBy('rank')->limit($limit);
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    /**
     * Get rank change
     */
    public function getRankChangeAttribute(): int
    {
        if ($this->previous_rank === null) {
            return 0;
        }
        
        return $this->previous_rank - $this->rank;
    }

    /**
     * Get rank change direction
     */
    public function getRankDirectionAttribute(): string
    {
        $change = $this->rank_change;
        
        if ($change > 0) {
            return 'up';
        } elseif ($change < 0) {
            return 'down';
        }
        
        return 'same';
    }

    /**
     * Check if rank improved
     */
    public function getHasImprovedAttribute(): bool
    {
        return $this->rank_change > 0;
    }
}
