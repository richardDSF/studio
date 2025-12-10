<?php

declare(strict_types=1);

namespace App\Events\Rewards;

use App\Models\Rewards\RewardUser;
use App\Models\Rewards\RewardBadge;
use App\Models\Rewards\RewardUserBadge;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BadgeEarned
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public RewardUser $rewardUser,
        public RewardBadge $badge,
        public RewardUserBadge $userBadge,
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
     * Get badge name
     */
    public function getBadgeName(): string
    {
        return $this->badge->name;
    }

    /**
     * Get badge rarity
     */
    public function getBadgeRarity(): string
    {
        return $this->badge->rarity;
    }

    /**
     * Get points awarded with badge
     */
    public function getPointsAwarded(): int
    {
        return $this->badge->points_reward ?? 0;
    }
}
