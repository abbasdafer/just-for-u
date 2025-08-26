"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoCodeManager = PromoCodeManager;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var appwrite_1 = require("@/lib/appwrite");
var appwrite_2 = require("appwrite");
var button_1 = require("@/components/ui/button");
var table_1 = require("@/components/ui/table");
var badge_1 = require("@/components/ui/badge");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var dialog_1 = require("@/components/ui/dialog");
var select_1 = require("@/components/ui/select");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var use_toast_1 = require("@/hooks/use-toast");
var card_1 = require("./ui/card");
var skeleton_1 = require("./ui/skeleton");
function PromoCodeManager() {
    var _this = this;
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_1.useState)([]), promoCodes = _a[0], setPromoCodes = _a[1];
    var _b = (0, react_1.useState)(false), isDialogOpen = _b[0], setDialogOpen = _b[1];
    var _c = (0, react_1.useState)({ code: "", type: "monthly", maxUses: "1" }), newCode = _c[0], setNewCode = _c[1];
    var _d = (0, react_1.useState)(true), loading = _d[0], setLoading = _d[1];
    var fetchPromoCodes = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, codesList, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, appwrite_1.databases.listDocuments('68ac3e83001e70c6e142', '68ac41470012db625149')];
                case 2:
                    result = _a.sent();
                    codesList = result.documents.map(function (doc) { return (__assign({}, doc)); });
                    setPromoCodes(codesList);
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _a.sent();
                    console.error("Error fetching promo codes: ", e_1);
                    toast({ variant: 'destructive', title: 'خطأ في جلب الرموز', description: e_1.message });
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        fetchPromoCodes();
    }, [toast]);
    var generateRandomCode = function () {
        var typePrefix = newCode.type === "monthly" ? "MONTHLY" : "YEARLY";
        var randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        setNewCode(function (prev) { return (__assign(__assign({}, prev), { code: "".concat(typePrefix).concat(randomPart) })); });
    };
    var handleAddCode = function () { return __awaiter(_this, void 0, void 0, function () {
        var maxUsesNum, newPromoData, docRef, addedCode_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    maxUsesNum = parseInt(newCode.maxUses, 10);
                    if (!newCode.code || !newCode.type || isNaN(maxUsesNum) || maxUsesNum < 1) {
                        toast({ variant: 'destructive', title: 'إدخال غير صالح', description: 'يرجى ملء جميع الحقول بشكل صحيح. يجب أن يكون الحد الأقصى للاستخدامات رقمًا أكبر من 0.' });
                        return [2 /*return*/];
                    }
                    newPromoData = {
                        code: newCode.code,
                        type: newCode.type,
                        status: 'active',
                        uses: 0,
                        maxUses: maxUsesNum,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, appwrite_1.databases.createDocument('68ac3e83001e70c6e142', '68ac41470012db625149', appwrite_2.ID.unique(), newPromoData)];
                case 2:
                    docRef = _a.sent();
                    addedCode_1 = __assign({ $id: docRef.$id }, newPromoData);
                    setPromoCodes(function (prev) { return __spreadArray([addedCode_1], prev, true); });
                    toast({ title: 'نجاح', description: 'تم إنشاء رمز الاشتراك.' });
                    setDialogOpen(false);
                    setNewCode({ code: "", type: "monthly", maxUses: "1" });
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    console.error("Error adding promo code: ", e_2);
                    toast({ variant: 'destructive', title: 'خطأ', description: e_2.message || 'لا يمكن إضافة رمز التفعيل.' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteCode = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, appwrite_1.databases.deleteDocument('68ac3e83001e70c6e142', '68ac41470012db625149', id)];
                case 1:
                    _a.sent();
                    setPromoCodes(promoCodes.filter(function (c) { return c.$id !== id; }));
                    toast({ title: 'تم حذف رمز الاشتراك.' });
                    return [3 /*break*/, 3];
                case 2:
                    e_3 = _a.sent();
                    console.error("Error deleting promo code: ", e_3);
                    toast({ variant: 'destructive', title: 'خطأ', description: 'لا يمكن حذف رمز الاشتراك.' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<card_1.Card>
      <card_1.CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <card_1.CardTitle>أكواد الاشتراك</card_1.CardTitle>
                <card_1.CardDescription>
                إنشاء وإدارة أكواد الاشتراك لمديري الصالات الرياضية الجدد.
                </card_1.CardDescription>
            </div>
          <dialog_1.Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <dialog_1.DialogTrigger asChild>
              <button_1.Button size="sm" className="gap-1">
                <lucide_react_1.PlusCircle className="h-3.5 w-3.5"/>
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  إضافة كود
                </span>
              </button_1.Button>
            </dialog_1.DialogTrigger>
            <dialog_1.DialogContent>
              <dialog_1.DialogHeader>
                <dialog_1.DialogTitle>إنشاء رمز اشتراك جديد</dialog_1.DialogTitle>
                <dialog_1.DialogDescription>
                  قم بإنشاء رمز جديد لتقديمه لعميل جديد.
                </dialog_1.DialogDescription>
              </dialog_1.DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label_1.Label htmlFor="code" className="text-right">الكود</label_1.Label>
                  <input_1.Input id="code" value={newCode.code} onChange={function (e) { return setNewCode(__assign(__assign({}, newCode), { code: e.target.value.trim() })); }} className="col-span-2"/>
                  <button_1.Button variant="outline" size="sm" onClick={generateRandomCode}>عشوائي</button_1.Button>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label_1.Label htmlFor="type" className="text-right">النوع</label_1.Label>
                  <select_1.Select value={newCode.type} onValueChange={function (v) { return setNewCode(__assign(__assign({}, newCode), { type: v })); }}>
                    <select_1.SelectTrigger className="col-span-3">
                      <select_1.SelectValue placeholder="اختر النوع"/>
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="monthly">اشتراك شهري</select_1.SelectItem>
                      <select_1.SelectItem value="yearly">اشتراك سنوي</select_1.SelectItem>
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label_1.Label htmlFor="maxUses" className="text-right">أقصى استخدام</label_1.Label>
                  <input_1.Input id="maxUses" type="number" min="1" value={newCode.maxUses} onChange={function (e) { return setNewCode(__assign(__assign({}, newCode), { maxUses: e.target.value })); }} className="col-span-3"/>
                </div>
              </div>
              <dialog_1.DialogFooter>
                <button_1.Button onClick={function () { return setDialogOpen(false); }} variant="outline">إلغاء</button_1.Button>
                <button_1.Button onClick={handleAddCode}>إنشاء كود</button_1.Button>
              </dialog_1.DialogFooter>
            </dialog_1.DialogContent>
          </dialog_1.Dialog>
        </div>
      </card_1.CardHeader>
      <card_1.CardContent>
        {loading ? (<div className="space-y-4 p-4">
             <skeleton_1.Skeleton className="h-12 w-full"/>
             <skeleton_1.Skeleton className="h-12 w-full"/>
             <skeleton_1.Skeleton className="h-12 w-full"/>
           </div>) : (<table_1.Table>
          <table_1.TableHeader>
            <table_1.TableRow>
              <table_1.TableHead>الكود</table_1.TableHead>
              <table_1.TableHead>النوع</table_1.TableHead>
              <table_1.TableHead>الحالة</table_1.TableHead>
              <table_1.TableHead>الاستخدام</table_1.TableHead>
              <table_1.TableHead>
                <span className="sr-only">الإجراءات</span>
              </table_1.TableHead>
            </table_1.TableRow>
          </table_1.TableHeader>
          <table_1.TableBody>
             {promoCodes.length === 0 ? (<table_1.TableRow>
                    <table_1.TableCell colSpan={5} className="h-24 text-center">
                    لم يتم العثور على رموز ترويجية. قم بإنشاء واحد للبدء.
                    </table_1.TableCell>
                </table_1.TableRow>) : (promoCodes.map(function (promo) { return (<table_1.TableRow key={promo.$id}>
                    <table_1.TableCell className="font-medium">{promo.code}</table_1.TableCell>
                    <table_1.TableCell>{promo.type === 'monthly' ? 'شهري' : 'سنوي'}</table_1.TableCell>
                    <table_1.TableCell>
                    <badge_1.Badge variant={promo.uses >= promo.maxUses ? "secondary" : "default"} className={promo.uses >= promo.maxUses ? '' : 'bg-green-500/20 text-green-700 hover:bg-green-500/30'}>{promo.uses >= promo.maxUses ? 'مستخدم' : 'نشط'}</badge_1.Badge>
                    </table_1.TableCell>
                    <table_1.TableCell>{promo.uses} / {promo.maxUses}</table_1.TableCell>
                    <table_1.TableCell>
                    <dropdown_menu_1.DropdownMenu>
                        <dropdown_menu_1.DropdownMenuTrigger asChild>
                        <button_1.Button aria-haspopup="true" size="icon" variant="ghost">
                            <lucide_react_1.MoreHorizontal className="h-4 w-4"/>
                            <span className="sr-only">تبديل القائمة</span>
                        </button_1.Button>
                        </dropdown_menu_1.DropdownMenuTrigger>
                        <dropdown_menu_1.DropdownMenuContent align="end">
                        <dropdown_menu_1.DropdownMenuLabel>الإجراءات</dropdown_menu_1.DropdownMenuLabel>
                        <dropdown_menu_1.DropdownMenuItem onSelect={function () { return handleDeleteCode(promo.$id); }} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <lucide_react_1.Trash2 className="ml-2 h-4 w-4"/>
                            حذف
                        </dropdown_menu_1.DropdownMenuItem>
                        </dropdown_menu_1.DropdownMenuContent>
                    </dropdown_menu_1.DropdownMenu>
                    </table_1.TableCell>
                </table_1.TableRow>); }))}
          </table_1.TableBody>
        </table_1.Table>)}
      </card_1.CardContent>
    </card_1.Card>);
}
