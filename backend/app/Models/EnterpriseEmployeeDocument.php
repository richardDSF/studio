<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnterpriseEmployeeDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'extension',
        'upload_date',
        'last_updated',
        'assigned_to_enterprise_name',
    ];

    protected $casts = [
        'upload_date' => 'date',
        'last_updated' => 'date',
    ];
}
