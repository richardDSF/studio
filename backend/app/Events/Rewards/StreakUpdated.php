<?php

declare(strict_types=1);

namespace App\Events\Rewards;

use App\Models\Rewards\RewardUser;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StreakUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public RewardUser $rewardUser,
        public int $previousStreak,
        public int $currentStreak,
        public bool $isNewRecord = false,
        public array $context = []
    ) {}

    /**
     * Get the user ID
     */
    public function getUserId(): int
    {
        return $this->rewardUser->user_id;
    }

    /**
     * Check if streak was broken
     */
    public function wasStreakBroken(): bool
    {
        return $this->currentStreak < $this->previousStreak;
    }

    /**
     * Check if this is a milestone (7, 14, 30, 60, 100 days)
     */
    public function isMilestone(): bool
    {
        $milestones = [7, 14, 30, 60, 100];
        return in_array($this->currentStreak, $milestones);
    }

    /**
     * Get longest streak
     */
    public function getLongestStreak(): int
    {
        return $this->rewardUser->longest_streak;
    }
}
