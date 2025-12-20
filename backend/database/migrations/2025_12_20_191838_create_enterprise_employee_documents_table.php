<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enterprise_employee_documents', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('extension');
            $table->date('upload_date');
            $table->date('last_updated')->nullable();
            $table->string('assigned_to_enterprise_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enterprise_employee_documents');
    }
};
