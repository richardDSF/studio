<?php

declare(strict_types=1);

namespace App\Events\Rewards;

use App\Models\Rewards\RewardUser;
use App\Models\Rewards\RewardRedemption;
use App\Models\Rewards\RewardCatalogItem;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RewardRedeemed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public RewardUser $rewardUser,
        public RewardCatalogItem $catalogItem,
        public RewardRedemption $redemption,
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
     * Get item name
     */
    public function getItemName(): string
    {
        return $this->catalogItem->name;
    }

    /**
     * Get points spent
     */
    public function getPointsSpent(): int
    {
        return $this->redemption->points_spent;
    }

    /**
     * Get redemption status
     */
    public function getStatus(): string
    {
        return $this->redemption->status;
    }
}
