<?php

declare(strict_types=1);

namespace App\Events\Rewards;

use App\Models\Rewards\RewardUser;
use App\Models\Rewards\RewardTransaction;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PointsEarned
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public RewardUser $rewardUser,
        public int $amount,
        public string $type,
        public ?RewardTransaction $transaction = null,
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
     * Get total points after this transaction
     */
    public function getTotalPoints(): int
    {
        return $this->rewardUser->total_points;
    }

    /**
     * Get lifetime points
     */
    public function getLifetimePoints(): int
    {
        return $this->rewardUser->lifetime_points;
    }
}
