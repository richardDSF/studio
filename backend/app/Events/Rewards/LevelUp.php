<?php

declare(strict_types=1);

namespace App\Events\Rewards;

use App\Models\Rewards\RewardUser;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LevelUp
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public RewardUser $rewardUser,
        public int $previousLevel,
        public int $newLevel,
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
     * Get how many levels were gained
     */
    public function getLevelsGained(): int
    {
        return $this->newLevel - $this->previousLevel;
    }

    /**
     * Check if this is a milestone level (every 10 levels)
     */
    public function isMilestone(): bool
    {
        return $this->newLevel % 10 === 0;
    }

    /**
     * Get current XP
     */
    public function getCurrentXp(): int
    {
        return $this->rewardUser->experience_points;
    }
}
