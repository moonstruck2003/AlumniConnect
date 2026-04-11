<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role')->default('student');
            $table->string('linkedin_url')->nullable();
            $table->text('short_bio')->nullable();
            $table->string('job_title')->nullable();
            $table->string('company')->nullable();
            $table->string('student_id')->nullable();
            $table->string('department')->nullable();
            $table->decimal('cgpa', 3, 2)->nullable();
            $table->string('recruiter_company')->nullable();
            $table->boolean('is_accepting_mentees')->default(false);
            $table->string('location')->nullable();
            $table->integer('graduation_year')->nullable();
            $table->string('industry')->nullable();
            $table->json('skills')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
