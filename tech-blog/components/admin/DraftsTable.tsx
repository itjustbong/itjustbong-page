"use client";

import { useState } from "react";
import { Draft } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, FileEdit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface DraftsTableProps {
  drafts: Draft[];
}

const categoryColors: Record<string, string> = {
  frontend: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  backend: "bg-green-500/10 text-green-600 dark:text-green-400",
  docker: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  blockchain: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  ai: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export function DraftsTable({ drafts }: DraftsTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/drafts/${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
        setDeleteId(null);
      } else {
        alert("임시저장 삭제에 실패했습니다.");
      }
    } catch {
      alert("임시저장 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
          <FileEdit className="text-muted-foreground h-6 w-6" />
        </div>
        <p className="text-muted-foreground mt-4 text-sm font-medium">
          임시저장된 글이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">제목</TableHead>
              <TableHead className="font-semibold">카테고리</TableHead>
              <TableHead className="font-semibold">저장일</TableHead>
              <TableHead className="text-right font-semibold">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drafts.map((draft) => (
              <TableRow key={draft.id} className="group">
                <TableCell>
                  <div className="max-w-md">
                    <div className="text-foreground line-clamp-1 font-medium">
                      {draft.title || "제목 없음"}
                    </div>
                    <div className="text-muted-foreground mt-0.5 line-clamp-1 text-sm">
                      {draft.description || "설명 없음"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={categoryColors[draft.category] || ""}
                  >
                    {draft.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(draft.savedAt).toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() =>
                        router.push(`/admin/editor?draft=${draft.id}`)
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => setDeleteId(draft.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open: boolean) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>임시저장을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 임시저장된 글이 영구적으로
              삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
