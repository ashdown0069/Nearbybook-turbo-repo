import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldGroup,
  FieldError,
  FieldSet,
} from "@workspace/ui/components/field"
import { sendFeedback } from "@workspace/data-access"
import { RotateCcw } from "lucide-react"
import { axiosInstance } from "@/lib/axios"

export default function FeedbackForm() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "pending" | "error" | "success"
  >("idle")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    email: "",
  })

  const [errors, setErrors] = useState<{
    title?: string
    description?: string
    email?: string
  }>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!formData.title.trim()) newErrors.title = "제목을 입력해주세요."
    if (!formData.description.trim())
      newErrors.description = "내용을 입력해주세요."
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      setSubmitStatus("pending")
      await sendFeedback(
        axiosInstance,
        formData.title,
        formData.description,
        formData.email || undefined
      )
      setFormData({ title: "", description: "", email: "" })
      alert("제출이 완료되었습니다.")
      setSubmitStatus("success")
    } catch (error) {
      setSubmitStatus("error")
    }
  }

  if (submitStatus === "error") {
    return (
      <section className="flex h-screen items-center justify-center">
        <div className="p-2 text-sm">
          <Button
            className="mx-auto mt-2 flex w-[200px] cursor-pointer justify-center bg-green-500 text-white hover:bg-green-400 hover:text-white"
            onClick={() => {
              window.location.reload()
            }}
            variant="ghost"
          >
            <RotateCcw className="mr-2" />
            새로고침
          </Button>
        </div>
      </section>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldSet>
        <FieldGroup className="space-y-8">
          <Field>
            <FieldLabel className="text-xl after:text-red-500 after:content-['*']">
              제목
            </FieldLabel>
            <FieldDescription>
              기능제안, 버그제보 등 내용을 간단히 요약해주세요
            </FieldDescription>
            <FieldContent>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-2/3 text-base"
                placeholder="제목을 입력하세요"
              />
            </FieldContent>
            <FieldError
              errors={errors.title ? [{ message: errors.title }] : []}
            />
          </Field>

          <Field>
            <FieldLabel className="text-xl after:text-red-500 after:content-['*']">
              상세설명
            </FieldLabel>
            <FieldDescription>
              발생한 오류를 상세히 설명해주시거나 원하는 기능이 있다면
              제안해주세요.
            </FieldDescription>
            <FieldContent>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={300}
                className="h-24 w-full resize-none text-base"
                placeholder="내용을 상세히 적어주세요"
              />
            </FieldContent>
            <FieldError
              errors={
                errors.description ? [{ message: errors.description }] : []
              }
            />
          </Field>
          <Field>
            <FieldLabel className="text-xl">Email</FieldLabel>
            <FieldDescription>답변을 받을 이메일 주소</FieldDescription>
            <FieldContent>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-2/3 text-base"
                placeholder="test@gmail.com"
              />
            </FieldContent>
            <FieldError
              errors={errors.email ? [{ message: errors.email }] : []}
            />
          </Field>

          <Button
            disabled={submitStatus === "pending"}
            type="submit"
            className="mt-4 w-full cursor-pointer bg-green-500 px-4 py-4 text-base hover:bg-green-400"
          >
            제출하기
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
