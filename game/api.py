from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from account.models import Word

from .serializers import WordSerializer

from .words import get_random



class GameAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, r, *args, **kwargs):
        user = r.user
        for_ = r.GET.get('for')
        match for_:
            case 'wordlen':
                word = user.getTodaysWord
                if not word:
                    newword = Word.objects.create(
                        user=user,
                        text=get_random()
                    )
                    newword.save()
                    data=len(newword.text)
                else: data=len(word.text)
            case 'progress':
                word = user.getTodaysWord
                letters = index_list(word.text, list(set(word.correct_attempts+word.bought)))
                data = {"found":letters, "attempts":word.wrong_attempts}
            case 'buyletter':
                word = user.getTodaysWord
                found_letters = word.correct_attempts+word.bought
                if word.found:
                    data = {"detail":"The word has already been found"}
                    return Response()
                l_ind = int(r.GET.get('i'))
                if word.text[l_ind] in found_letters:
                    data = {"detail":"This letter has already been found"}
                    return Response(data=data)
                
                if user.balance-word.text.count(word.text[l_ind])>=0: 
                    user.balance-=word.text.count(word.text[l_ind])
                for i in range(word.text.count(word.text[l_ind])):
                    word.bought.append(word.text[l_ind])
                word.save()
                if word.found:
                    user.balance+=len(word.text)
                user.save()
                data = {'letters':index_list(word.text, list(word.text[l_ind])), 'found':word.found}
            case 'tryletter':
                word = user.getTodaysWord
                if word.found:
                    data = {'detail':'The word has already been found'}
                    return Response(data=data)
                l = r.GET.get('l').lower()
                if l in word.correct_attempts:
                    data = {'detail': 'This letter has already been found'}
                elif l in word.wrong_attempts:
                    data = {'detail': 'This letter has already been tried'}
                elif l not in word.text:
                    user.balance-=1
                    user.save()
                    data = {"detail":"Wrong attempt"}
                    word.wrong_attempts.append(l)
                    word.save()
                else:
                    user.balance+=word.text.count(l)
                    word.correct_attempts.append(l)
                    word.save()
                    if word.found:
                        user.balance+=len(word.text)
                    user.save()
                    data = {'letters':index_list(word.text, [l]),'found':word.found}

        return Response(data=data)







class WordListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = WordSerializer

    def get_queryset(self):
        return Word.objects.all(user=self.request.user)
    
class WordRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WordSerializer

    def get_queryset(self):
        return Word.objects.all(user=self.request.user)




def index_list(i, l):
    result = {}
    for i, char in enumerate(i):
        if char in l:
            if char not in result:
                result[char] = []
            result[char].append(i)
    return result