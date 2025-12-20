<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EnterpriseEmployeeDocument;
use Illuminate\Http\Request;

class EnterpriseEmployeeDocumentController extends Controller
{
    public function index()
    {
        return response()->json(EnterpriseEmployeeDocument::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'extension' => 'required|string|max:50',
            'upload_date' => 'required|date',
            'last_updated' => 'nullable|date',
            'assigned_to_enterprise_name' => 'required|string|max:255',
        ]);

        $document = EnterpriseEmployeeDocument::create($validated);
        return response()->json($document, 201);
    }

    public function show(string $id)
    {
        $document = EnterpriseEmployeeDocument::findOrFail($id);
        return response()->json($document);
    }

    public function update(Request $request, string $id)
    {
        $document = EnterpriseEmployeeDocument::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'extension' => 'sometimes|required|string|max:50',
            'upload_date' => 'sometimes|required|date',
            'last_updated' => 'nullable|date',
            'assigned_to_enterprise_name' => 'sometimes|required|string|max:255',
        ]);

        $document->update($validated);
        return response()->json($document);
    }
    

    public function destroy(string $id)
    {
        $document = EnterpriseEmployeeDocument::findOrFail($id);
        $document->delete();
        return response()->json(null, 204);
    }
}
